"""
Trading Service - Paper Trading (Virtual Money)
"""
from config.database import db, Portfolio, Transaction, UserBalance
from datetime import datetime
from .data_service import DataService

class TradingService:
    """Service for paper trading operations"""
    
    @staticmethod
    def get_user_balance(user_id):
        """Get user's balance information"""
        try:
            balance = UserBalance.query.filter_by(user_id=user_id).first()
            
            if not balance:
                # Create initial balance
                balance = UserBalance(user_id=user_id)
                db.session.add(balance)
                db.session.commit()
            
            # Calculate portfolio value
            portfolio = Portfolio.query.filter_by(user_id=user_id).all()
            
            total_portfolio_value = 0
            total_invested = 0
            
            for holding in portfolio:
                current_price = DataService.get_real_time_price(holding.stock.symbol)
                if current_price:
                    total_portfolio_value += holding.quantity * current_price
                    total_invested += holding.total_invested
            
            total_profit_loss = total_portfolio_value - total_invested
            
            return {
                'cash_balance': balance.cash_balance,
                'total_portfolio_value': round(total_portfolio_value, 2),
                'total_invested': round(total_invested, 2),
                'total_profit_loss': round(total_profit_loss, 2),
                'total_value': round(balance.cash_balance + total_portfolio_value, 2)
            }
            
        except Exception as e:
            print(f"Error getting balance: {str(e)}")
            return None
    
    @staticmethod
    def buy_stock(user_id, symbol, quantity):
        """Buy stock (paper trading)"""
        try:
            # Get current price
            current_price = DataService.get_real_time_price(symbol)
            
            if not current_price:
                return {'error': 'Unable to fetch stock price'}, 400
            
            total_cost = current_price * quantity
            
            # Check balance
            balance = UserBalance.query.filter_by(user_id=user_id).first()
            
            if not balance or balance.cash_balance < total_cost:
                return {'error': 'Insufficient funds'}, 400
            
            # Get or create stock in DB
            stock = DataService.store_stock_in_db(symbol)
            
            if not stock:
                return {'error': 'Invalid stock symbol'}, 400
            
            # Update or create portfolio entry
            portfolio_item = Portfolio.query.filter_by(
                user_id=user_id,
                stock_id=stock.id
            ).first()
            
            if portfolio_item:
                # Update existing holding
                new_total_quantity = portfolio_item.quantity + quantity
                new_total_invested = portfolio_item.total_invested + total_cost
                portfolio_item.avg_buy_price = new_total_invested / new_total_quantity
                portfolio_item.quantity = new_total_quantity
                portfolio_item.total_invested = new_total_invested
            else:
                # Create new holding
                portfolio_item = Portfolio(
                    user_id=user_id,
                    stock_id=stock.id,
                    quantity=quantity,
                    avg_buy_price=current_price,
                    total_invested=total_cost
                )
                db.session.add(portfolio_item)
            
            # Deduct from balance
            balance.cash_balance -= total_cost
            
            # Record transaction
            transaction = Transaction(
                user_id=user_id,
                stock_id=stock.id,
                transaction_type='BUY',
                quantity=quantity,
                price=current_price,
                total_amount=total_cost
            )
            db.session.add(transaction)
            
            db.session.commit()
            
            return {
                'message': f'Successfully bought {quantity} shares of {symbol}',
                'transaction': transaction.to_dict()
            }, 200
            
        except Exception as e:
            db.session.rollback()
            print(f"Error buying stock: {str(e)}")
            return {'error': str(e)}, 500
    
    @staticmethod
    def sell_stock(user_id, symbol, quantity):
        """Sell stock (paper trading)"""
        try:
            # Get current price
            current_price = DataService.get_real_time_price(symbol)
            
            if not current_price:
                return {'error': 'Unable to fetch stock price'}, 400
            
            # Find stock
            stock = DataService.store_stock_in_db(symbol)
            
            if not stock:
                return {'error': 'Invalid stock symbol'}, 400
            
            # Find portfolio item
            portfolio_item = Portfolio.query.filter_by(
                user_id=user_id,
                stock_id=stock.id
            ).first()
            
            if not portfolio_item or portfolio_item.quantity < quantity:
                return {'error': 'Insufficient shares to sell'}, 400
            
            total_sale = current_price * quantity
            
            # Update portfolio
            portfolio_item.quantity -= quantity
            
            # Calculate proportion of investment being sold
            proportion_sold = quantity / (portfolio_item.quantity + quantity)
            investment_recovered = portfolio_item.total_invested * proportion_sold
            portfolio_item.total_invested -= investment_recovered
            
            # If all shares sold, remove from portfolio
            if portfolio_item.quantity == 0:
                db.session.delete(portfolio_item)
            
            # Add to balance
            balance = UserBalance.query.filter_by(user_id=user_id).first()
            balance.cash_balance += total_sale
            
            # Record transaction
            transaction = Transaction(
                user_id=user_id,
                stock_id=stock.id,
                transaction_type='SELL',
                quantity=quantity,
                price=current_price,
                total_amount=total_sale
            )
            db.session.add(transaction)
            
            db.session.commit()
            
            return {
                'message': f'Successfully sold {quantity} shares of {symbol}',
                'transaction': transaction.to_dict()
            }, 200
            
        except Exception as e:
            db.session.rollback()
            print(f"Error selling stock: {str(e)}")
            return {'error': str(e)}, 500
    
    @staticmethod
    def get_portfolio(user_id):
        """Get user's portfolio with current values"""
        try:
            holdings = Portfolio.query.filter_by(user_id=user_id).all()
            
            portfolio = []
            
            for holding in holdings:
                current_price = DataService.get_real_time_price(holding.stock.symbol)
                
                if current_price:
                    current_value = holding.quantity * current_price
                    profit_loss = current_value - holding.total_invested
                    profit_loss_percent = (profit_loss / holding.total_invested) * 100
                    
                    portfolio.append({
                        'id': holding.id,
                        'symbol': holding.stock.symbol,
                        'name': holding.stock.name,
                        'quantity': holding.quantity,
                        'avg_buy_price': round(holding.avg_buy_price, 2),
                        'total_invested': round(holding.total_invested, 2),
                        'current_price': round(current_price, 2),
                        'current_value': round(current_value, 2),
                        'profit_loss': round(profit_loss, 2),
                        'profit_loss_percent': round(profit_loss_percent, 2)
                    })
            
            return portfolio
            
        except Exception as e:
            print(f"Error getting portfolio: {str(e)}")
            return []
    
    @staticmethod
    def get_transactions(user_id, limit=50):
        """Get user's transaction history"""
        try:
            transactions = Transaction.query.filter_by(user_id=user_id)\
                .order_by(Transaction.timestamp.desc())\
                .limit(limit)\
                .all()
            
            return [t.to_dict() for t in transactions]
            
        except Exception as e:
            print(f"Error getting transactions: {str(e)}")
            return []
