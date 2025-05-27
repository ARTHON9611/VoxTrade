import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2 } from 'lucide-react';

interface MarketOrdersProps {
  market: string;
  isLoading: boolean;
}

const MarketOrders: React.FC<MarketOrdersProps> = ({ market, isLoading }) => {
  const [orderType, setOrderType] = React.useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = React.useState('');
  const [price, setPrice] = React.useState('');
  
  // Extract tokens from market
  const [baseToken, quoteToken] = market.split('/');
  
  // Calculate total
  const total = React.useMemo(() => {
    if (!amount || !price) return '0.00';
    return (parseFloat(amount) * parseFloat(price)).toFixed(2);
  }, [amount, price]);
  
  // Handle order submission
  const handleSubmitOrder = () => {
    // In a real implementation, this would submit the order to the API
    console.log('Submitting order:', {
      type: orderType,
      market,
      amount,
      price,
      total
    });
    
    // Reset form
    setAmount('');
    setPrice('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Market Orders</span>
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Order type selector */}
          <div className="flex rounded-md overflow-hidden">
            <Button
              type="button"
              className={`flex-1 rounded-none ${orderType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setOrderType('buy')}
            >
              Buy
            </Button>
            <Button
              type="button"
              className={`flex-1 rounded-none ${orderType === 'sell' ? 'bg-red-500 hover:bg-red-600' : 'bg-muted text-muted-foreground'}`}
              onClick={() => setOrderType('sell')}
            >
              Sell
            </Button>
          </div>
          
          {/* Amount input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Amount</label>
            </div>
            <div className="flex">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="rounded-r-none"
              />
              <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                {baseToken}
              </div>
            </div>
          </div>
          
          {/* Price input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Price</label>
            </div>
            <div className="flex">
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="rounded-r-none"
              />
              <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                {quoteToken}
              </div>
            </div>
          </div>
          
          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Total</label>
            </div>
            <div className="flex">
              <Input
                type="text"
                value={total}
                readOnly
                className="rounded-r-none bg-muted"
              />
              <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted">
                {quoteToken}
              </div>
            </div>
          </div>
          
          {/* Submit button */}
          <Button
            type="button"
            className={`w-full ${orderType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
            onClick={handleSubmitOrder}
            disabled={!amount || !price || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `${orderType === 'buy' ? 'Buy' : 'Sell'} ${baseToken}`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOrders;
