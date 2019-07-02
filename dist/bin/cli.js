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
    'libp2-identity': {
        alias: 'L',
        description: 'json file, containing the private and public keys for libp2p',
        requiresArg: true,
        required: false,
        type: 'string'
    },
    'devp2p-identity': {
        alias: 'I',
        description: 'json file, containing the private and public keys for devp2p',
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
            options.libp2pIdentity = options.libp2Identity
                ? yield Promise.resolve().then(() => __importStar(require(options.libp2Identity)))
                : config.libp2Identity;
            options.devp2pIdentity = options.devp2Identity
                ? yield Promise.resolve().then(() => __importStar(require(options.libp2Identity)))
                : config.libp2pIdentity;
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
                console.log(`\nshutting down client...`);
                setTimeout(() => process.exit(0), 5000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYmluL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRVosZ0NBQXdDO0FBRXhDLGdEQUF1QjtBQUN2Qiw0Q0FBbUI7QUFFbkIsa0RBQXlCO0FBQ3pCLE1BQU0sS0FBSyxHQUFHLGVBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUVuQyxNQUFNLFNBQVMsR0FBUTtJQUNyQixjQUFjLEVBQUU7UUFDZCxLQUFLLEVBQUUsR0FBRztRQUNWLFdBQVcsRUFBRSx3Q0FBd0M7UUFDckQsV0FBVyxFQUFFLElBQUk7UUFDakIsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsT0FBTztLQUNkO0lBQ0Qsa0JBQWtCLEVBQUU7UUFDbEIsS0FBSyxFQUFFLEdBQUc7UUFDVixXQUFXLEVBQUUsZ0NBQWdDO1FBQzdDLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFFLE9BQU87S0FDZDtJQUNELFdBQVcsRUFBRTtRQUNYLEtBQUssRUFBRSxHQUFHO1FBQ1YsV0FBVyxFQUFFLFdBQVc7UUFDeEIsV0FBVyxFQUFFLElBQUk7UUFDakIsUUFBUSxFQUFFLEtBQUs7UUFDZixPQUFPLEVBQUUsTUFBTTtRQUNmLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7S0FDekI7SUFDRCxXQUFXLEVBQUU7UUFDWCxLQUFLLEVBQUUsR0FBRztRQUNWLFdBQVcsRUFBRSxxQ0FBcUM7UUFDbEQsV0FBVyxFQUFFLElBQUk7UUFDakIsUUFBUSxFQUFFLEtBQUs7UUFDZixJQUFJLEVBQUUsT0FBTztLQUNkO0lBQ0QsYUFBYSxFQUFFO1FBQ2IsS0FBSyxFQUFFLEdBQUc7UUFDVixXQUFXLEVBQUUsYUFBYTtRQUMxQixXQUFXLEVBQUUsSUFBSTtRQUNqQixRQUFRLEVBQUUsS0FBSztRQUNmLE9BQU8sRUFB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QUFjLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDOUQsTUFBTSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7WUFFdEIsTUFBTSxPQUFPLEdBQUcsR0FBUyxFQUFFO2dCQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUE7Z0JBQ3hDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUN2QyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUN2QixDQUFDLENBQUEsQ0FBQTtZQUVELGtDQUFrQztZQUNsQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUM5QixPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUM3QixPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUMvQixDQUFDO0tBQUE7Q0FDRjtBQUVELE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUMxQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDakIsQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJO0lBQ0YsaURBQWlEO0lBQ2pELFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtDQUNsQjtBQUFDLE9BQU8sR0FBRyxFQUFFO0lBQ1osS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0NBQ1giLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IHsgS2l0c3VuZXRGYWN0b3J5IH0gZnJvbSAnLi4vc3JjJ1xuXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5pbXBvcnQgRGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBkZWJ1ZyA9IERlYnVnKCdraXRzdW5ldDpjbGknKVxuXG5jb25zdCBjbGlDb25maWc6IGFueSA9IHtcbiAgJ2xpYnAycC1hZGRycyc6IHtcbiAgICBhbGlhczogJ2EnLFxuICAgIGRlc2NyaXB0aW9uOiAnbGlzdCBvZiBsaWJwMnAgbXVsdGlhZGRycyB0byBsaXN0ZW4gb24nLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnYXJyYXknXG4gIH0sXG4gICdsaWJwMnAtYm9vdHN0cmFwJzoge1xuICAgIGFsaWFzOiAnQScsXG4gICAgZGVzY3JpcHRpb246ICdsaXN0IG9mIGxpYnAycCBib290c3RyYXAgbm9kZXMnLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnYXJyYXknXG4gIH0sXG4gICdzeW5jLW1vZGUnOiB7XG4gICAgYWxpYXM6ICdzJyxcbiAgICBkZXNjcmlwdGlvbjogJ3N5bmMgbW9kZScsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHQ6ICdmYXN0JyxcbiAgICBjaG9pY2VzOiBbJ2Zhc3QnLCAna3NuJ11cbiAgfSxcbiAgJ2V0aC1hZGRycyc6IHtcbiAgICBhbGlhczogJ2UnLFxuICAgIGRlc2NyaXB0aW9uOiAnbGlzdCBvZiBFdGhlcmV1bSBhZGRyZXNzZXMgdG8gdHJhY2snLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnYXJyYXknXG4gIH0sXG4gICdkZXZwMnAtcG9ydCc6IHtcbiAgICBhbGlhczogJ1AnLFxuICAgIGRlc2NyaXB0aW9uOiAnZGV2cDJwIHBvcnQnLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZWZhdWx0OiAzMDMwMyxcbiAgICB0eXBlOiAnbnVtYmVyJ1xuICB9LFxuICAnc3RhY2tzJzoge1xuICAgIGFsaWFzOiAnUycsXG4gICAgZGVzY3JpcHRpb246ICdzdGFja3MnLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZWZhdWx0OiBbJ2RldnAycCcsICdsaWJwMnAnXSxcbiAgICBjaG9pY2VzOiBbJ2RldnAycCcsICdsaWJwMnAnXVxuICB9LFxuICAvLyBUT0RPOiBtYWtlIHRoaXMgcmVxdWlyZWQgaWYgaW4gYnJpZGdlIG1vZGVcbiAgJ3JwYy11cmwnOiB7XG4gICAgYWxpYXM6ICdyJyxcbiAgICBkZXNjcmlwdGlvbjogJ2JyaWRnZSBycGMgdXJsIDxodHRwW3NdOi8vaG9zdDpwb3J0PicsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlXG4gIH0sXG4gICdycGMtcG9sbC1pbnRlcnZhbCc6IHtcbiAgICBkZXNjcmlwdGlvbjogJ3JwYyBwb2xsIGludGVydmFsIGluIG1pbGxpc2Vjb25kcycsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHQ6IDEwICogMTAwMFxuICB9LFxuICBicmlkZ2U6IHtcbiAgICBhbGlhczogJ2InLFxuICAgIGRlc2NyaXB0aW9uOiAnZW5hYmxlIGJyaWRnZSBtb2RlIC0gcmVhZCBzbGljZXMgZnJvbSB0aGUgcnBjJyxcbiAgICByZXF1aXJlc0FyZzogZmFsc2UsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHR5cGU6ICdib29sZWFuJ1xuICB9LFxuICAnZXRoLWNoYWluLWRiJzoge1xuICAgIGFsaWFzOiAnRCcsXG4gICAgZGVzY3JpcHRpb246ICd0aGUgYmxvY2tjaGFpbiBkYiBwYXRoJyxcbiAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgZGVmYXVsdDogJy4vLmtpdHN1bmV0L2NoYWluLWRiLycsXG4gICAgdHlwZTogJ3N0cmluZydcbiAgfSxcbiAgJ2V0aC1uZXR3b3JrJzoge1xuICAgIGRlc2NyaXB0aW9uOiBgdGhlIGJsb2NrY2hhaW4gbmV0d29yayBuYW1lIC0gJ21haW5uZXQnIGJ5IGRlZmF1bHRgLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBkZWZhdWx0OiAnbWFpbm5ldCcsXG4gICAgdHlwZTogJ3N0cmluZydcbiAgfSxcbiAgJ3NsaWNlLXBhdGgnOiB7XG4gICAgYWxpYXM6ICdwJyxcbiAgICBkZXNjcmlwdGlvbjogJ3NsaWNlIHBhdGgnLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnYXJyYXknXG4gIH0sXG4gICdzbGljZS1kZXB0aCc6IHtcbiAgICBhbGlhczogJ2QnLFxuICAgIGRlc2NyaXB0aW9uOiAnc2xpY2UgZGVwdGgnLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICB9LFxuICAnc2xpY2UtZmlsZSc6IHtcbiAgICBhbGlhczogJ2YnLFxuICAgIGRlc2NyaXB0aW9uOiAnc2xpY2UgZGVwdGgnLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZVxuICB9LFxuICAnbGlicDItaWRlbnRpdHknOiB7XG4gICAgYWxpYXM6ICdMJyxcbiAgICBkZXNjcmlwdGlvbjogJ2pzb24gZmlsZSwgY29udGFpbmluZyB0aGUgcHJpdmF0ZSBhbmQgcHVibGljIGtleXMgZm9yIGxpYnAycCcsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIHR5cGU6ICdzdHJpbmcnXG4gIH0sXG4gICdkZXZwMnAtaWRlbnRpdHknOiB7XG4gICAgYWxpYXM6ICdJJyxcbiAgICBkZXNjcmlwdGlvbjogJ2pzb24gZmlsZSwgY29udGFpbmluZyB0aGUgcHJpdmF0ZSBhbmQgcHVibGljIGtleXMgZm9yIGRldnAycCcsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlXG4gIH0sXG4gIGNvbmZpZzoge1xuICAgIGFsaWFzOiAnYycsXG4gICAgZGVzY3JpcHRpb246ICdwYXRoIHRvIGNvbmZpZyBmaWxlJyxcbiAgICBjb25maWc6IHRydWUsXG4gICAgcmVxdWlyZXNBcmc6IHRydWUsXG4gICAgcmVxdWlyZWQ6IGZhbHNlXG4gIH0sXG4gICdkaWFsLWludGVydmFsJzoge1xuICAgIGFsaWFzOiAnZGYnLFxuICAgIGRlc2NyaXB0aW9uOiAnZGlhbCBmcmVxdWVuY3knLFxuICAgIHJlcXVpcmVzQXJnOiB0cnVlLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0eXBlOiAnaW50ZWdlcidcbiAgfVxufVxuXG5jbGFzcyBLaXN0dW5ldENsaSB7XG4gIHN0YXRpYyBhc3luYyBydW4gKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSByZXF1aXJlKCd5YXJncycpXG4gICAgICAudXNhZ2UoYEtpdHN1bmV0IGNtZCBjbGllbnRgKVxuICAgICAgLm9wdGlvbnMoY2xpQ29uZmlnKVxuICAgICAgLmhlbHAoJ2hlbHAnKVxuICAgICAgLmFsaWFzKCdoZWxwJywgJ2gnKVxuICAgICAgLmFyZ3ZcblxuICAgIGxldCBjb25maWc6IGFueSA9IHt9XG4gICAgaWYgKG9wdGlvbnMuY29uZmlnKSB7XG4gICAgICBjb25maWcgPSBvcHRpb25zLmNvbmZpZ1xuICAgIH1cblxuICAgIG9wdGlvbnMuTk9ERV9FTlYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAncHJvZCdcbiAgICBvcHRpb25zLmxpYnAycElkZW50aXR5ID0gb3B0aW9ucy5saWJwMklkZW50aXR5XG4gICAgICA/IGF3YWl0IGltcG9ydChvcHRpb25zLmxpYnAySWRlbnRpdHkpXG4gICAgICA6IGNvbmZpZy5saWJwMklkZW50aXR5XG5cbiAgICBvcHRpb25zLmRldnAycElkZW50aXR5ID0gb3B0aW9ucy5kZXZwMklkZW50aXR5XG4gICAgICA/IGF3YWl0IGltcG9ydChvcHRpb25zLmxpYnAySWRlbnRpdHkpXG4gICAgICA6IGNvbmZpZy5saWJwMnBJZGVudGl0eVxuXG4gICAgb3B0aW9ucy5saWJwMnBBZGRycyA9IG9wdGlvbnMubGlicDJwQWRkcnMgfHwgb3B0aW9ucy5saWJwMlBBZGRycyB8fCBjb25maWcubGlicDJwQWRkcnNcbiAgICBvcHRpb25zLmNoYWluRGIgPSBwYXRoLnJlc29sdmUob3B0aW9ucy5ldGhDaGFpbkRiKVxuXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKG9wdGlvbnMuY2hhaW5EYikpIHtcbiAgICAgIGZzLm1rZGlyU3luYyhvcHRpb25zLmNoYWluRGIsIHtcbiAgICAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICAgICAgICBtb2RlOiAwbzc1NVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBraXRzdW5ldCA9IGF3YWl0IEtpdHN1bmV0RmFjdG9yeS5jcmVhdGVLaXRzdW5ldChvcHRpb25zKVxuICAgIGF3YWl0IGtpdHN1bmV0LnN0YXJ0KClcblxuICAgIGNvbnN0IGNsZWFudXAgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgXFxuc2h1dHRpbmcgZG93biBjbGllbnQuLi5gKVxuICAgICAgc2V0VGltZW91dCgoKSA9PiBwcm9jZXNzLmV4aXQoMCksIDUwMDApXG4gICAgICBhd2FpdCBraXRzdW5ldC5zdG9wKClcbiAgICB9XG5cbiAgICAvLyBsaXN0ZW4gZm9yIGdyYWNlZnVsIHRlcm1pbmF0aW9uXG4gICAgcHJvY2Vzcy5vbignU0lHVEVSTScsIGNsZWFudXApXG4gICAgcHJvY2Vzcy5vbignU0lHSU5UJywgY2xlYW51cClcbiAgICBwcm9jZXNzLm9uKCdTSUdIVVAnLCBjbGVhbnVwKVxuICB9XG59XG5cbnByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24pID0+IHtcbiAgY29uc29sZS5lcnJvcihyZWFzb24pXG4gIHByb2Nlc3MuZXhpdCgxKVxufSlcblxudHJ5IHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1mbG9hdGluZy1wcm9taXNlc1xuICBLaXN0dW5ldENsaS5ydW4oKVxufSBjYXRjaCAoZXJyKSB7XG4gIGRlYnVnKGVycilcbn1cbiJdfQ==