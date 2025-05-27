import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useTrading } from '../../contexts/TradingContext';
import { Transaction } from '../../types/modality';
import { Loader2 } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, isLoading }) => {
  const [activeTab, setActiveTab] = React.useState('all');
  
  // Filter transactions based on active tab
  const filteredTransactions = React.useMemo(() => {
    if (activeTab === 'all') {
      return transactions;
    }
    return transactions.filter(transaction => transaction.type === activeTab);
  }, [transactions, activeTab]);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Transaction History</span>
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="border rounded-md p-3 hover:bg-muted transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium capitalize ${
                              transaction.type === 'buy' ? 'text-green-500' : 
                              transaction.type === 'sell' ? 'text-red-500' : 
                              'text-blue-500'
                            }`}>
                              {transaction.type}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {transaction.timestamp}
                            </span>
                          </div>
                          <div className="mt-1">
                            {transaction.type === 'swap' ? (
                              <span>
                                {transaction.amount} {transaction.token} → {transaction.toAmount} {transaction.toToken}
                              </span>
                            ) : (
                              <span>
                                {transaction.amount} {transaction.token}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
