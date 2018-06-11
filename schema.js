const fetch = require('node-fetch');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat
} = require('graphql');

const TickerType = new GraphQLObjectType({
    name: 'Ticker',
    description : 'a ticker',
    fields: {
        name: {
            type: GraphQLString,
            resolve: json => json.name
        },
        symbol: {
            type: GraphQLString,
            resolve: json => json.symbol
        },
        rank: {
            type: GraphQLInt,
            resolve: json => json.rank
        },
        priceUSD: {
            type: GraphQLFloat,
            resolve: json => json.price_usd
        },
        priceBTC: {
            type: GraphQLFloat,
            resolve: json => json.price_btc
        },
        dailyVolumeUSD: {
            type: GraphQLFloat,
            resolve: json => json["24h_volume_usd"]
        },
        marketCapUSD: {
            type: GraphQLFloat,
            resolve: json => json.market_cap_usd
        },
        availableSupply: {
            type: GraphQLFloat,
            resolve: json => json.available_supply
        },
        totalSupply: {
            type: GraphQLFloat,
            resolve: json => json.total_supply
        },
        percentChange1h: {
            type: GraphQLFloat,
            resolve: json => json.percent_change_1h
        },
        percentChange24h: {
            type: GraphQLFloat,
            resolve: json => json.percent_change_24h
        },
        percentChange7d: {
            type: GraphQLFloat,
            resolve: json => json.percent_change_7d
        },
        lastUpdated: {
            type: GraphQLInt,
            resolve: json => json.last_updated
        }
    }
});

const GlobalType = new GraphQLObjectType({
    name: 'Global',
    description: 'Global data about markets',
    fields: {
        totalMarketCapUSD: {
            type: GraphQLFloat,
            resolve: json => json.total_market_cap_usd
        },
        total24hVolumeUSD: {
            type: GraphQLFloat,
            resolve: json => json.total_24h_volume_usd
        },
        bitcoinPercentageOfMarketCap: {
            type: GraphQLFloat,
            resolve: json => json.bitcoin_percentage_of_market_cap
        },
        activeCurrencies: {
            type: GraphQLInt,
            resolve: json => json.active_currencies
        },
        activeAssets: {
            type: GraphQLInt,
            resolve: json => json.active_assets
        },
        activeMarkets: {
            type: GraphQLInt,
            resolve: json => json.active_markets
        }
    }
});

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'get a list of tickers',
        fields: {
            tickers: {
                type: new GraphQLList(TickerType),
                args: {
                    limit: {type: GraphQLInt},
                    start: {type: GraphQLInt},
                },
                resolve: (root, args) => fetch(
                    `https://api.coinmarketcap.com/v1/ticker/?limit=${args.limit || 100}&start=${args.start || 0}`
                )
                .then(response => response.json())
            },
            ticker: {
                type: new GraphQLList(TickerType),
                args: {
                    id: { type: GraphQLString }
                },
                resolve: (root, args) => fetch(
                    `https://api.coinmarketcap.com/v1/ticker/${args.id}`
                )
                .then(response => response.json())
            },
            global: {
                type: GlobalType,
                resolve: (root, args) => fetch(
                    `https://api.coinmarketcap.com/v1/global`
                )
                .then(response => response.json())
            }
        }
    })
});

module.exports = schema;