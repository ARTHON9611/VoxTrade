import Foundation
import Combine

class APIService {
    static let shared = APIService()
    
    private let baseURL = "https://api.multimodaltrading.com"
    private var cancellables = Set<AnyCancellable>()
    
    private init() {}
    
    // Generic request function
    func request<T: Decodable>(endpoint: String, method: HTTPMethod = .get, parameters: [String: Any]? = nil, headers: [String: String]? = nil) -> AnyPublisher<T, Error> {
        // Create URL
        guard let url = URL(string: baseURL + endpoint) else {
            return Fail(error: APIError.invalidURL).eraseToAnyPublisher()
        }
        
        // Create request
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        
        // Add headers
        var defaultHeaders = [
            "Content-Type": "application/json",
            "Accept": "application/json"
        ]
        
        if let token = UserDefaults.standard.string(forKey: "auth_token") {
            defaultHeaders["Authorization"] = "Bearer \(token)"
        }
        
        if let headers = headers {
            for (key, value) in headers {
                defaultHeaders[key] = value
            }
        }
        
        for (key, value) in defaultHeaders {
            request.setValue(value, forHTTPHeaderField: key)
        }
        
        // Add parameters
        if let parameters = parameters {
            if method == .get {
                // Add query parameters
                var components = URLComponents(url: url, resolvingAgainstBaseURL: false)!
                components.queryItems = parameters.map { URLQueryItem(name: $0.key, value: "\($0.value)") }
                request.url = components.url
            } else {
                // Add body parameters
                do {
                    request.httpBody = try JSONSerialization.data(withJSONObject: parameters)
                } catch {
                    return Fail(error: APIError.encodingFailed).eraseToAnyPublisher()
                }
            }
        }
        
        // Make request
        return URLSession.shared.dataTaskPublisher(for: request)
            .tryMap { data, response in
                guard let httpResponse = response as? HTTPURLResponse else {
                    throw APIError.invalidResponse
                }
                
                guard 200..<300 ~= httpResponse.statusCode else {
                    throw APIError.serverError(statusCode: httpResponse.statusCode, data: data)
                }
                
                return data
            }
            .decode(type: T.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    // MARK: - Auth Endpoints
    
    func login(email: String, password: String) -> AnyPublisher<AuthResponse, Error> {
        let parameters = [
            "email": email,
            "password": password
        ]
        
        return request(endpoint: "/api/auth/login", method: .post, parameters: parameters)
    }
    
    func connectWallet(address: String, signature: String) -> AnyPublisher<AuthResponse, Error> {
        let parameters = [
            "address": address,
            "signature": signature
        ]
        
        return request(endpoint: "/api/auth/wallet", method: .post, parameters: parameters)
    }
    
    // MARK: - Trading Endpoints
    
    func getMarketData(symbol: String) -> AnyPublisher<MarketData, Error> {
        return request(endpoint: "/api/market/ticker", parameters: ["symbol": symbol])
    }
    
    func getOrderBook(symbol: String, depth: Int = 10) -> AnyPublisher<OrderBook, Error> {
        let parameters = [
            "symbol": symbol,
            "depth": depth
        ] as [String : Any]
        
        return request(endpoint: "/api/market/orderbook", parameters: parameters)
    }
    
    func getCandles(symbol: String, interval: String, limit: Int = 100) -> AnyPublisher<[Candle], Error> {
        let parameters = [
            "symbol": symbol,
            "interval": interval,
            "limit": limit
        ] as [String : Any]
        
        return request(endpoint: "/api/market/candles", parameters: parameters)
    }
    
    func getSwapQuote(fromToken: String, toToken: String, amount: String, slippage: String) -> AnyPublisher<SwapQuoteResponse, Error> {
        let parameters = [
            "fromToken": fromToken,
            "toToken": toToken,
            "amount": amount,
            "slippage": slippage
        ]
        
        return request(endpoint: "/api/trade/quote", parameters: parameters)
    }
    
    func executeSwap(fromToken: String, toToken: String, amount: String, slippage: String) -> AnyPublisher<SwapResponse, Error> {
        let parameters = [
            "fromToken": fromToken,
            "toToken": toToken,
            "amount": amount,
            "slippage": slippage
        ]
        
        return request(endpoint: "/api/trade/swap", method: .post, parameters: parameters)
    }
    
    func getBalances() -> AnyPublisher<BalanceResponse, Error> {
        return request(endpoint: "/api/wallet/balance")
    }
    
    func getOrderHistory() -> AnyPublisher<[TransactionResponse], Error> {
        return request(endpoint: "/api/wallet/history")
    }
    
    // MARK: - Voice Processing Endpoints
    
    func processVoiceCommand(command: String) -> AnyPublisher<CommandResponse, Error> {
        let parameters = ["command": command]
        
        return request(endpoint: "/api/voice/process-command", method: .post, parameters: parameters)
    }
}

// MARK: - Helper Types

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
}

enum APIError: Error {
    case invalidURL
    case invalidResponse
    case encodingFailed
    case serverError(statusCode: Int, data: Data)
}

// MARK: - Response Models

struct AuthResponse: Decodable {
    let token: String
    let user: User
}

struct User: Decodable {
    let id: String
    let email: String?
    let walletAddress: String?
}

struct MarketData: Decodable {
    let price: String
    let change24h: String
    let volume24h: String
    let high24h: String
    let low24h: String
}

struct OrderBook: Decodable {
    let bids: [OrderBookEntry]
    let asks: [OrderBookEntry]
}

struct OrderBookEntry: Decodable {
    let price: String
    let amount: String
}

struct Candle: Decodable {
    let timestamp: TimeInterval
    let open: String
    let high: String
    let low: String
    let close: String
    let volume: String
}

struct SwapQuoteResponse: Decodable {
    let fromToken: String
    let toToken: String
    let fromAmount: String
    let toAmount: String
    let minAmount: String
    let rate: String
    let slippage: String
    let fee: String
    let expiresAt: TimeInterval
}

struct SwapResponse: Decodable {
    let txId: String
    let fromToken: String
    let toToken: String
    let fromAmount: String
    let toAmount: String
    let rate: String
    let fee: String
    let timestamp: TimeInterval
    let status: String
}

struct BalanceResponse: Decodable {
    let balances: [String: String]
}

struct TransactionResponse: Decodable {
    let id: String
    let type: String
    let token: String
    let amount: String
    let toToken: String?
    let toAmount: String?
    let timestamp: String
    let status: String
}

struct CommandResponse: Decodable {
    let type: String
    let params: [String: String]
    let message: String
}
