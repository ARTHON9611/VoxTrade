import SwiftUI
import Charts

struct ChartView: View {
    @State private var chartData: [CandleStick] = []
    let symbol: String
    let timeframe: String
    let onTimeframeChange: (String) -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            // Chart Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(symbol)
                        .font(.headline)
                    
                    HStack(spacing: 8) {
                        Text("$103.42")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Text("+2.5%")
                            .font(.subheadline)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 2)
                            .background(Color.green.opacity(0.1))
                            .foregroundColor(.green)
                            .cornerRadius(4)
                    }
                }
                
                Spacer()
                
                // Timeframe Selector
                HStack(spacing: 8) {
                    timeframeButton(label: "1H", value: "1h")
                    timeframeButton(label: "1D", value: "1d")
                    timeframeButton(label: "1W", value: "1w")
                    timeframeButton(label: "1M", value: "1m")
                }
            }
            
            // Chart
            if #available(iOS 16.0, *) {
                Chart {
                    ForEach(chartData) { candle in
                        RectangleMark(
                            x: .value("Time", candle.date),
                            yStart: .value("Low", candle.low),
                            yEnd: .value("High", candle.high),
                            width: 3
                        )
                        .foregroundStyle(candle.close > candle.open ? Color.green : Color.red)
                        
                        RectangleMark(
                            x: .value("Time", candle.date),
                            yStart: .value("Open", candle.open),
                            yEnd: .value("Close", candle.close),
                            width: 8
                        )
                        .foregroundStyle(candle.close > candle.open ? Color.green : Color.red)
                    }
                }
                .chartYScale(domain: chartYDomain.0...chartYDomain.1)
                .frame(height: 200)
            } else {
                // Fallback for iOS 15
                Text("Chart visualization requires iOS 16 or later")
                    .foregroundColor(.gray)
                    .frame(height: 200)
                    .frame(maxWidth: .infinity)
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(8)
            }
        }
        .padding()
        .onAppear {
            loadChartData()
        }
        .onChange(of: timeframe) { _ in
            loadChartData()
        }
        .onChange(of: symbol) { _ in
            loadChartData()
        }
    }
    
    // Timeframe Button
    private func timeframeButton(label: String, value: String) -> some View {
        Button(action: {
            onTimeframeChange(value)
        }) {
            Text(label)
                .font(.caption)
                .fontWeight(.medium)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(timeframe == value ? Color(hex: "4F46E5") : Color(hex: "F3F4F6"))
                .foregroundColor(timeframe == value ? .white : .primary)
                .cornerRadius(6)
        }
    }
    
    // Load Chart Data
    private func loadChartData() {
        // In a real implementation, this would call the API
        // For demo purposes, we'll generate mock data
        
        var newData: [CandleStick] = []
        let basePrice = 103.42
        let now = Date()
        
        // Generate candles based on timeframe
        let timeInterval: TimeInterval
        let count: Int
        let volatility: Double
        
        switch timeframe {
        case "1h":
            timeInterval = 60 * 2 // 2 minutes per candle
            count = 30 // 1 hour
            volatility = 0.5
        case "1d":
            timeInterval = 60 * 30 // 30 minutes per candle
            count = 48 // 1 day
            volatility = 1.0
        case "1w":
            timeInterval = 60 * 60 * 4 // 4 hours per candle
            count = 42 // 1 week
            volatility = 2.0
        case "1m":
            timeInterval = 60 * 60 * 24 // 1 day per candle
            count = 30 // 1 month
            volatility = 3.0
        default:
            timeInterval = 60 * 2
            count = 30
            volatility = 0.5
        }
        
        for i in 0..<count {
            let date = now.addingTimeInterval(-Double(count - i) * timeInterval)
            
            // Add some randomness and trend
            let randomFactor = Double.random(in: -volatility...volatility)
            let trendFactor = Double(i) * 0.02
            
            // Add some sine wave pattern for realism
            let sineWave = sin(Double(i) / Double(count / 3)) * (volatility / 2)
            
            let open = basePrice + randomFactor + trendFactor + sineWave
            let close = open + Double.random(in: -volatility/2...volatility/2)
            let high = max(open, close) + Double.random(in: 0...volatility/4)
            let low = min(open, close) - Double.random(in: 0...volatility/4)
            
            newData.append(CandleStick(
                date: date,
                open: open,
                high: high,
                low: low,
                close: close
            ))
        }
        
        chartData = newData
    }
    
    // Calculate Y-axis domain
    private var chartYDomain: (Double, Double) {
        guard !chartData.isEmpty else { return (100, 110) }
        
        let minValue = chartData.map { $0.low }.min() ?? 0
        let maxValue = chartData.map { $0.high }.max() ?? 0
        
        // Add some padding
        let padding = (maxValue - minValue) * 0.1
        return (minValue - padding, maxValue + padding)
    }
}

// Candlestick Model
struct CandleStick: Identifiable {
    let id = UUID()
    let date: Date
    let open: Double
    let high: Double
    let low: Double
    let close: Double
}

struct ChartView_Previews: PreviewProvider {
    static var previews: some View {
        ChartView(
            symbol: "SOL/USDC",
            timeframe: "1h",
            onTimeframeChange: { _ in }
        )
        .previewLayout(.sizeThatFits)
        .padding()
    }
}
