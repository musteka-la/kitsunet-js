'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default('kitsunet:cli');
const cliConfig = {
    'libp2p-addrs': {
        alias: 'a',
        description: 'list of libp2p multiaddrs to listen on',
        requiresArg: true,
        required: false,
        type: 'array'
    },
    'libp2p-bootstrap': {
        alias: 'A',
        description: 'list of libp2p bootstrap nodes',
        requiresArg: true,
        required: false,
        type: 'array'
    },
    'sync-mode': {
        alias: 's',
        description: 'sync mode',
        requiresArg: true,
        required: false,
        default: 'fast',
        choices: ['fast', 'ksn']
    },
    'eth-addrs': {
        alias: 'e',
        description: 'list of Ethereum addresses to track',
        requiresArg: true,
        required: false,
        type: 'array'
    },
    'devp2p-port': {
        alias: 'P',
        description: 'devp2p port',
        requiresArg: true,
        required: false,
        default: 30303,
        type: 'number'
    },
    'stacks': {
        alias: 'S',
        description: 'stacks',
        requiresArg: true,
        required: false,
        default: ['devp2p', 'libp2p'],
        choices: ['devp2p', 'libp2p']
    },
    // TODO: make this required if in bridge mode
    'rpc-url': {
        alias: 'r',
        description: 'bridge rpc url <http[s]://host:port>',
        requiresArg: true,
        required: false
    },
    'rpc-poll-interval': {
        description: 'rpc poll interval in milliseconds',
        requiresArg: true,
        required: false,
        default: 10 * 1000
    },
    bridge: {
        alias: 'b',
        description: 'enable bridge mode - read slices from the rpc',
        requiresArg: false,
        required: false,
        default: false,
        type: 'boolean'
    },
    'eth-chain-db': {
        alias: 'D',
        description: 'the blockchain db path',
        requiresArg: true,
        required: false,
        default: './.kitsunet/chain-db/',
        type: 'string'
    },
    'eth-network': {
        description: `the blockchain network name - 'mainnet' by default`,
        requiresArg: true,
        required: false,
        default: 'mainnet',
        type: 'string'
    },
    'slice-path': {
        alias: 'p',
        description: 'slice path',
        requiresArg: true,
        required: false,
        type: 'array'
    },
    'slice-depth': {
        alias: 'd',
        description: 'slice depth',
        requiresArg: true,
        required: false,
        type: 'string'
    },
    'slice-file': {
        alias: 'f',
        description: 'slice depth',
        requiresArg: true,
        required: false
    },
    identity: {
        alias: 'i',
        description: 'json peer info file, containing the private and public keys',
        requiresArg: true,
        required: false
    },
    config: {
        alias: 'c',
        description: 'path to config file',
        config: true,
        requiresArg: true,
        required: false
    },
    'dial-interval': {
        alias: 'df',
        description: 'dial frequency',
        requiresArg: true,
        required: false,
        type: 'integer'
    }
};
class KistunetCli {
    static run() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = require('yargs')
                .usage(`Kitsunet cmd client`)
                .options(cliConfig)
                .help('help')
                .alias('help', 'h')
                .argv;
            let config = {};
            if (options.config) {
                config = options.config;
            }
            options.NODE_ENV = process.env.NODE_ENV || 'prod';
            options.identity = options.identity ? yield Promise.resolve().then(() => __importStar(require(options.identity))) : config.identity;
            options.libp2pAddrs = options.libp2pAddrs || options.libp2PAddrs || config.libp2pAddrs;
            options.chainDb = path_1.default.resolve(options.ethChainDb);
            if (!fs_1.default.existsSync(options.chainDb)) {
                fs_1.default.mkdirSync(options.chainDb, {
                    recursive: true,
                    mode: 0o755
                });
            }
            const kitsunet = yield src_1.KitsunetFactory.createKitsunet(options);
            yield kitsunet.start();
            const cleanup = () => __awaiter(this, void 0, void 0, function* () {
                console.log(`shutting down client...`);
                yield kitsunet.stop();
            });
            // listen for graceful termination
            process.on('SIGTERM', cleanup);
            process.on('SIGINT', cleanup);
            process.on('SIGHUP', cleanup);
        });
    }
}
process.on('unhandledRejection', (reason) => {
    console.error(reason);
    process.exit(1);
});
try {
    // tslint:disable-next-line: no-floating-promises
    KistunetCli.run();
}
catch (err) {
    debug(err);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYmluL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosZ0NBQXdDO0FBRXhDLGdEQUF1QjtBQUN2Qiw0Q0FBbUI7QUFFbkIsa0RBQXlCO0FBQ3pCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUVuQyxNQUFNLFNBQVMsR0FBUTtJQUNyQixjQUFjLEVBQUU7UUFDZCxLQUFLLEVBQUUsR0FBRztRQUNWLFdBQVcsRUFBRSx3Q0FBd0M7UUFDckQsV0FBVyxFQUFFLElBQUk7UUFDakIsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsT0FBTztLQUNkO0lBQ0Qsa0JBQWtCLEVBQUU7UUFDbEIsS0FBSyxFQUFFLEdBQUc7UUFDVixXQUFXLEVBQUUsZ0NBQWdDO1FBQzdDLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLE9BQU87S0FDZDtJQUNELFdBQVcsRUFBRTtRQUNYLEtBQUssRUFBRSxHQUFHO1FBQ1YsV0FBVyxFQUFFLFdBQVc7UUFDeEIsV0FBVyxFQUFFLElBQUk7UUFDakIsUUFBUSxFQUFFLEtBQUs7UUFDZixPQUFPLEVBQUUsTUFBTTtRQUNmLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7S0FDekI7SUFDRCxXQUFXLEVBQUU7UUFDWCxLQUFLLEVBQUUsR0FBRztRQUNWLFdBQVcsRUFBRSxxQ0FBcUM7UUFDbEQsV0FBVyxFQUFFLElBQUk7UUFDakIsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsT0FBTztLQUNkO0lBQ0QsYUFBYSxFQUFFO1FBQ2IsS0FBSyxFQUFFLEdBQUc7UUFDVixXQUFXLEVBQUUsYUFBYTtRQUMxQixXQUFXLEVBQUUsSUFBSTtRQUNqQixRQUFRLEVBQUUsS0FBSztRQUNmLE9BQU8sRUFB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O1lBQzlCLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQzdCLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQy9CLENBQUM7S0FBQTtDQUNGO0FBRUQsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO0lBQzFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqQixDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUk7SUFDRixpREFBaUQ7SUFDakQsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFBO0NBQ2xCO0FBQUMsT0FBTyxHQUFHLEVBQUU7SUFDWixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7Q0FDWCIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5pbXBvcnQgeyBLaXRzdW5ldEZhY3RvcnkgfSBmcm9tICcuLi9zcmMnXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMnXG5cbmltcG9ydCBEZWJ1ZyBmcm9tICdkZWJ1ZydcbmNvbnN0IGRlYnVnID0gRGVidWcoJ2tpdHN1bmV0OmNsaScpXG5cbmNvbnN0IGNsaUNvbmZpZzogYW55ID0ge1xuICAnbGlicDJwLWFkZHJzJzoge1xuICAgIGFsaWFzOiAnYScsXG4gICAgZGVzY3JpcHRpb246ICdsaXN0IG9mIGxpYnAycCBtdWx0aWFkZHJzIHRvIGxpc3RlbiBvbicsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdhcnJheSdcbiAgfSxcbiAgJ2xpYnAycC1ib290c3RyYXAnOiB7XG4gICAgYWxpYXM6ICdBJyxcbiAgICBkZXNjcmlwdGlvbjogJ2xpc3Qgb2YgbGlicDJwIGJvb3RzdHJhcCBub2RlcycsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdhcnJheSdcbiAgfSxcbiAgJ3N5bmMtbW9kZSc6IHtcbiAgICBhbGlhczogJ3MnLFxuICAgIGRlc2NyaXB0aW9uOiAnc3luYyBtb2RlJyxcbiAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVmYXVsdDogJ2Zhc3QnLFxuICAgIGNob2ljZXM6IFsnZmFzdCcsICdrc24nXVxuICB9LFxuICAnZXRoLWFkZHJzJzoge1xuICAgIGFsaWFzOiAnZScsXG4gICAgZGVzY3JpcHRpb246ICdsaXN0IG9mIEV0aGVyZXVtIGFkZHJlc3NlcyB0byB0cmFjaycsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdhcnJheSdcbiAgfSxcbiAgJ2RldnAycC1wb3J0Jzoge1xuICAgIGFsaWFzOiAnUCcsXG4gICAgZGVzY3JpcHRpb246ICdkZXZwMnAgcG9ydCcsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHQ6IDMwMzAzLFxuICAgIHR5cGU6ICdudW1iZXInXG4gIH0sXG4gICdzdGFja3MnOiB7XG4gICAgYWxpYXM6ICdTJyxcbiAgICBkZXNjcmlwdGlvbjogJ3N0YWNrcycsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHQ6IFsnZGV2cDJwJywgJ2xpYnAycCddLFxuICAgIGNob2ljZXM6IFsnZGV2cDJwJywgJ2xpYnAycCddXG4gIH0sXG4gIC8vIFRPRE86IG1ha2UgdGhpcyByZXF1aXJlZCBpZiBpbiBicmlkZ2UgbW9kZVxuICAncnBjLXVybCc6IHtcbiAgICBhbGlhczogJ3InLFxuICAgIGRlc2NyaXB0aW9uOiAnYnJpZGdlIHJwYyB1cmwgPGh0dHBbc106Ly9ob3N0OnBvcnQ+JyxcbiAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICByZXF1aXJlZDogZmFsc2VcbiAgfSxcbiAgJ3JwYy1wb2xsLWludGVydmFsJzoge1xuICAgIGRlc2NyaXB0aW9uOiAncnBjIHBvbGwgaW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzJyxcbiAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVmYXVsdDogMTAgKiAxMDAwXG4gIH0sXG4gIGJyaWRnZToge1xuICAgIGFsaWFzOiAnYicsXG4gICAgZGVzY3JpcHRpb246ICdlbmFibGUgYnJpZGdlIG1vZGUgLSByZWFkIHNsaWNlcyBmcm9tIHRoZSBycGMnLFxuICAgIHJlcXVpcmVzQXJnOiBmYWxzZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gIH0sXG4gICdldGgtY2hhaW4tZGInOiB7XG4gICAgYWxpYXM6ICdEJyxcbiAgICBkZXNjcmlwdGlvbjogJ3RoZSBibG9ja2NoYWluIGRiIHBhdGgnLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZWZhdWx0OiAnLi8ua2l0c3VuZXQvY2hhaW4tZGIvJyxcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICB9LFxuICAnZXRoLW5ldHdvcmsnOiB7XG4gICAgZGVzY3JpcHRpb246IGB0aGUgYmxvY2tjaGFpbiBuZXR3b3JrIG5hbWUgLSAnbWFpbm5ldCcgYnkgZGVmYXVsdGAsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHQ6ICdtYWlubmV0JyxcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICB9LFxuICAnc2xpY2UtcGF0aCc6IHtcbiAgICBhbGlhczogJ3AnLFxuICAgIGRlc2NyaXB0aW9uOiAnc2xpY2UgcGF0aCcsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdhcnJheSdcbiAgfSxcbiAgJ3NsaWNlLWRlcHRoJzoge1xuICAgIGFsaWFzOiAnZCcsXG4gICAgZGVzY3JpcHRpb246ICdzbGljZSBkZXB0aCcsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdzdHJpbmcnXG4gIH0sXG4gICdzbGljZS1maWxlJzoge1xuICAgIGFsaWFzOiAnZicsXG4gICAgZGVzY3JpcHRpb246ICdzbGljZSBkZXB0aCcsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlXG4gIH0sXG4gIGlkZW50aXR5OiB7XG4gICAgYWxpYXM6ICdpJyxcbiAgICBkZXNjcmlwdGlvbjogJ2pzb24gcGVlciBpbmZvIGZpbGUsIGNvbnRhaW5pbmcgdGhlIHByaXZhdGUgYW5kIHB1YmxpYyBrZXlzJyxcbiAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICByZXF1aXJlZDogZmFsc2VcbiAgfSxcbiAgY29uZmlnOiB7XG4gICAgYWxpYXM6ICdjJyxcbiAgICBkZXNjcmlwdGlvbjogJ3BhdGggdG8gY29uZmlnIGZpbGUnLFxuICAgIGNvbmZpZzogdHJ1ZSxcbiAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICByZXF1aXJlZDogZmFsc2VcbiAgfSxcbiAgJ2RpYWwtaW50ZXJ2YWwnOiB7XG4gICAgYWxpYXM6ICdkZicsXG4gICAgZGVzY3JpcHRpb246ICdkaWFsIGZyZXF1ZW5jeScsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICB9XG59XG5cbmNsYXNzIEtpc3R1bmV0Q2xpIHtcbiAgc3RhdGljIGFzeW5jIHJ1biAoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHJlcXVpcmUoJ3lhcmdzJylcbiAgICAgIC51c2FnZShgS2l0c3VuZXQgY21kIGNsaWVudGApXG4gICAgICAub3B0aW9ucyhjbGlDb25maWcpXG4gICAgICAuaGVscCgnaGVscCcpXG4gICAgICAuYWxpYXMoJ2hlbHAnLCAnaCcpXG4gICAgICAuYXJndlxuXG4gICAgbGV0IGNvbmZpZzogYW55ID0ge31cbiAgICBpZiAob3B0aW9ucy5jb25maWcpIHtcbiAgICAgIGNvbmZpZyA9IG9wdGlvbnMuY29uZmlnXG4gICAgfVxuXG4gICAgb3B0aW9ucy5OT0RFX0VOViA9IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdwcm9kJ1xuICAgIG9wdGlvbnMuaWRlbnRpdHkgPSBvcHRpb25zLmlkZW50aXR5ID8gYXdhaXQgaW1wb3J0KG9wdGlvbnMuaWRlbnRpdHkpIDogY29uZmlnLmlkZW50aXR5XG4gICAgb3B0aW9ucy5saWJwMnBBZGRycyA9IG9wdGlvbnMubGlicDJwQWRkcnMgfHwgb3B0aW9ucy5saWJwMlBBZGRycyB8fCBjb25maWcubGlicDJwQWRkcnNcbiAgICBvcHRpb25zLmNoYWluRGIgPSBwYXRoLnJlc29sdmUob3B0aW9ucy5ldGhDaGFpbkRiKVxuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKG9wdGlvbnMuY2hhaW5EYikpIHtcbiAgICAgIGZzLm1rZGlyU3luYyhvcHRpb25zLmNoYWluRGIsIHtcbiAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgICAgICBtb2RlOiAwbzc1NVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBraXRzdW5ldCA9IGF3YWl0IEtpdHN1bmV0RmFjdG9yeS5jcmVhdGVLaXRzdW5ldChvcHRpb25zKVxuICAgIGF3YWl0IGtpdHN1bmV0LnN0YXJ0KClcblxuICAgIGNvbnN0IGNsZWFudXAgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgc2h1dHRpbmcgZG93biBjbGllbnQuLi5gKVxuICAgICAgYXdhaXQga2l0c3VuZXQuc3RvcCgpXG4gICAgfVxuXG4gICAgLy8gbGlzdGVuIGZvciBncmFjZWZ1bCB0ZXJtaW5hdGlvblxuICAgIHByb2Nlc3Mub24oJ1NJR1RFUk0nLCBjbGVhbnVwKVxuICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsIGNsZWFudXApXG4gICAgcHJvY2Vzcy5vbignU0lHSFVQJywgY2xlYW51cClcbiAgfVxufVxuXG5wcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCAocmVhc29uKSA9PiB7XG4gIGNvbnNvbGUuZXJyb3IocmVhc29uKVxuICBwcm9jZXNzLmV4aXQoMSlcbn0pXG5cbnRyeSB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tZmxvYXRpbmctcHJvbWlzZXNcbiAgS2lzdHVuZXRDbGkucnVuKClcbn0gY2F0Y2ggKGVycikge1xuICBkZWJ1ZyhlcnIpXG59XG4iXX0=