export = index;
declare type Callback<T> = <T>(err?: Error, res?: T) => void;
declare function index<T>(buf: any, func: any, length?: any, callback?: Callback<T>): void | Promise<T>;
declare namespace index {
  class Buffer {
    static BYTES_PER_ELEMENT: number;
    static alloc(size: any, fill: any, encoding: any): any;
    static allocUnsafe(size: any): any;
    static allocUnsafeSlow(size: any): any;
    static byteLength(string: any, encoding: any, ...args: any[]): any;
    static compare(buf1: any, buf2: any): any;
    static concat(list: any, length: any): any;
    static from(value: any, encodingOrOffset: any, length: any): any;
    static isBuffer(b: any): any;
    static isEncoding(encoding: any): any;
    static of(items: any): any;
    static poolSize: number;
    constructor(arg: any, encodingOrOffset: any, length: any);
    asciiSlice(): any;
    asciiWrite(): any;
    base64Slice(): any;
    base64Write(): any;
    compare(target: any, start: any, end: any, thisStart: any, thisEnd: any, ...args: any[]): any;
    copy(target: any, targetStart: any, sourceStart: any, sourceEnd: any): any;
    copyWithin(p0: any, p1: any): any;
    entries(): any;
    equals(otherBuffer: any): any;
    every(p0: any): any;
    fill(val: any, start: any, end: any, encoding: any): any;
    filter(p0: any): any;
    find(p0: any): any;
    findIndex(p0: any): any;
    forEach(p0: any): any;
    hexSlice(): any;
    hexWrite(): any;
    includes(val: any, byteOffset: any, encoding: any): any;
    indexOf(val: any, byteOffset: any, encoding: any): any;
    inspect(): any;
    join(p0: any): any;
    keys(): any;
    lastIndexOf(val: any, byteOffset: any, encoding: any): any;
    latin1Slice(): any;
    latin1Write(): any;
    map(p0: any): any;
    readDoubleBE(offset: any): any;
    readDoubleLE(offset: any): any;
    readFloatBE(offset: any): any;
    readFloatLE(offset: any): any;
    readInt16BE(offset: any): any;
    readInt16LE(offset: any): any;
    readInt32BE(offset: any): any;
    readInt32LE(offset: any): any;
    readInt8(offset: any): any;
    readIntBE(offset: any, byteLength: any): any;
    readIntLE(offset: any, byteLength: any): any;
    readUInt16BE(offset: any): any;
    readUInt16LE(offset: any): any;
    readUInt32BE(offset: any): any;
    readUInt32LE(offset: any): any;
    readUInt8(offset: any): any;
    readUIntBE(offset: any, byteLength: any): any;
    readUIntLE(offset: any, byteLength: any): any;
    reduce(p0: any): any;
    reduceRight(p0: any): any;
    reverse(): any;
    set(p0: any): any;
    slice(start: any, end: any): any;
    some(p0: any): any;
    sort(p0: any): any;
    subarray(p0: any, p1: any): any;
    swap16(): any;
    swap32(): any;
    swap64(): any;
    toJSON(): any;
    toLocaleString(encoding: any, start: any, end: any, ...args: any[]): any;
    toString(encoding: any, start: any, end: any, ...args: any[]): any;
    ucs2Slice(): any;
    ucs2Write(): any;
    utf8Slice(): any;
    utf8Write(): any;
    values(): any;
    write(string: any, offset: any, length: any, encoding: any): any;
    writeDoubleBE(val: any, offset: any): any;
    writeDoubleLE(val: any, offset: any): any;
    writeFloatBE(val: any, offset: any): any;
    writeFloatLE(val: any, offset: any): any;
    writeInt16BE(value: any, offset: any): any;
    writeInt16LE(value: any, offset: any): any;
    writeInt32BE(value: any, offset: any): any;
    writeInt32LE(value: any, offset: any): any;
    writeInt8(value: any, offset: any): any;
    writeIntBE(value: any, offset: any, byteLength: any): any;
    writeIntLE(value: any, offset: any, byteLength: any): any;
    writeUInt16BE(value: any, offset: any): any;
    writeUInt16LE(value: any, offset: any): any;
    writeUInt32BE(value: any, offset: any): any;
    writeUInt32LE(value: any, offset: any): any;
    writeUInt8(value: any, offset: any): any;
    writeUIntBE(value: any, offset: any, byteLength: any): any;
    writeUIntLE(value: any, offset: any, byteLength: any): any;
  }
  function createHash(func: any): any;
  function digest<T>(buf: any, func: any, length: any, callback?: Callback<T>): void | Promise<T>;
  namespace functions { }
  namespace multihash {
    const codes: {
      "17": string;
      "18": string;
      "19": string;
      "20": string;
      "21": string;
      "22": string;
      "23": string;
      "24": string;
      "25": string;
      "26": string;
      "27": string;
      "28": string;
      "29": string;
      "34": string;
      "35": string;
      "45569": string;
      "45570": string;
      "45571": string;
      "45572": string;
      "45573": string;
      "45574": string;
      "45575": string;
      "45576": string;
      "45577": string;
      "45578": string;
      "45579": string;
      "45580": string;
      "45581": string;
      "45582": string;
      "45583": string;
      "45584": string;
      "45585": string;
      "45586": string;
      "45587": string;
      "45588": string;
      "45589": string;
      "45590": string;
      "45591": string;
      "45592": string;
      "45593": string;
      "45594": string;
      "45595": string;
      "45596": string;
      "45597": string;
      "45598": string;
      "45599": string;
      "45600": string;
      "45601": string;
      "45602": string;
      "45603": string;
      "45604": string;
      "45605": string;
      "45606": string;
      "45607": string;
      "45608": string;
      "45609": string;
      "45610": string;
      "45611": string;
      "45612": string;
      "45613": string;
      "45614": string;
      "45615": string;
      "45616": string;
      "45617": string;
      "45618": string;
      "45619": string;
      "45620": string;
      "45621": string;
      "45622": string;
      "45623": string;
      "45624": string;
      "45625": string;
      "45626": string;
      "45627": string;
      "45628": string;
      "45629": string;
      "45630": string;
      "45631": string;
      "45632": string;
      "45633": string;
      "45634": string;
      "45635": string;
      "45636": string;
      "45637": string;
      "45638": string;
      "45639": string;
      "45640": string;
      "45641": string;
      "45642": string;
      "45643": string;
      "45644": string;
      "45645": string;
      "45646": string;
      "45647": string;
      "45648": string;
      "45649": string;
      "45650": string;
      "45651": string;
      "45652": string;
      "45653": string;
      "45654": string;
      "45655": string;
      "45656": string;
      "45657": string;
      "45658": string;
      "45659": string;
      "45660": string;
      "45661": string;
      "45662": string;
      "45663": string;
      "45664": string;
      "45825": string;
      "45826": string;
      "45827": string;
      "45828": string;
      "45829": string;
      "45830": string;
      "45831": string;
      "45832": string;
      "45833": string;
      "45834": string;
      "45835": string;
      "45836": string;
      "45837": string;
      "45838": string;
      "45839": string;
      "45840": string;
      "45841": string;
      "45842": string;
      "45843": string;
      "45844": string;
      "45845": string;
      "45846": string;
      "45847": string;
      "45848": string;
      "45849": string;
      "45850": string;
      "45851": string;
      "45852": string;
      "45853": string;
      "45854": string;
      "45855": string;
      "45856": string;
      "45857": string;
      "45858": string;
      "45859": string;
      "45860": string;
      "45861": string;
      "45862": string;
      "45863": string;
      "45864": string;
      "45865": string;
      "45866": string;
      "45867": string;
      "45868": string;
      "45869": string;
      "45870": string;
      "45871": string;
      "45872": string;
      "45873": string;
      "45874": string;
      "45875": string;
      "45876": string;
      "45877": string;
      "45878": string;
      "45879": string;
      "45880": string;
      "45881": string;
      "45882": string;
      "45883": string;
      "45884": string;
      "45885": string;
      "45886": string;
      "45887": string;
      "45888": string;
      "45889": string;
      "45890": string;
      "45891": string;
      "45892": string;
      "45893": string;
      "45894": string;
      "45895": string;
      "45896": string;
      "45897": string;
      "45898": string;
      "45899": string;
      "45900": string;
      "45901": string;
      "45902": string;
      "45903": string;
      "45904": string;
      "45905": string;
      "45906": string;
      "45907": string;
      "45908": string;
      "45909": string;
      "45910": string;
      "45911": string;
      "45912": string;
      "45913": string;
      "45914": string;
      "45915": string;
      "45916": string;
      "45917": string;
      "45918": string;
      "45919": string;
      "45920": string;
      "45921": string;
      "45922": string;
      "45923": string;
      "45924": string;
      "45925": string;
      "45926": string;
      "45927": string;
      "45928": string;
      "45929": string;
      "45930": string;
      "45931": string;
      "45932": string;
      "45933": string;
      "45934": string;
      "45935": string;
      "45936": string;
      "45937": string;
      "45938": string;
      "45939": string;
      "45940": string;
      "45941": string;
      "45942": string;
      "45943": string;
      "45944": string;
      "45945": string;
      "45946": string;
      "45947": string;
      "45948": string;
      "45949": string;
      "45950": string;
      "45951": string;
      "45952": string;
      "45953": string;
      "45954": string;
      "45955": string;
      "45956": string;
      "45957": string;
      "45958": string;
      "45959": string;
      "45960": string;
      "45961": string;
      "45962": string;
      "45963": string;
      "45964": string;
      "45965": string;
      "45966": string;
      "45967": string;
      "45968": string;
      "45969": string;
      "45970": string;
      "45971": string;
      "45972": string;
      "45973": string;
      "45974": string;
      "45975": string;
      "45976": string;
      "45977": string;
      "45978": string;
      "45979": string;
      "45980": string;
      "45981": string;
      "45982": string;
      "45983": string;
      "45984": string;
      "45985": string;
      "45986": string;
      "45987": string;
      "45988": string;
      "45989": string;
      "45990": string;
      "45991": string;
      "45992": string;
      "45993": string;
      "45994": string;
      "45995": string;
      "45996": string;
      "45997": string;
      "45998": string;
      "45999": string;
      "46000": string;
      "46001": string;
      "46002": string;
      "46003": string;
      "46004": string;
      "46005": string;
      "46006": string;
      "46007": string;
      "46008": string;
      "46009": string;
      "46010": string;
      "46011": string;
      "46012": string;
      "46013": string;
      "46014": string;
      "46015": string;
      "46016": string;
      "46017": string;
      "46018": string;
      "46019": string;
      "46020": string;
      "46021": string;
      "46022": string;
      "46023": string;
      "46024": string;
      "46025": string;
      "46026": string;
      "46027": string;
      "46028": string;
      "46029": string;
      "46030": string;
      "46031": string;
      "46032": string;
      "46033": string;
      "46034": string;
      "46035": string;
      "46036": string;
      "46037": string;
      "46038": string;
      "46039": string;
      "46040": string;
      "46041": string;
      "46042": string;
      "46043": string;
      "46044": string;
      "46045": string;
      "46046": string;
      "46047": string;
      "46048": string;
      "86": string;
    };
    function coerceCode(name: any): any;
    function decode(buf: any): any;
    const defaultLengths: {
      "17": number;
      "18": number;
      "19": number;
      "20": number;
      "21": number;
      "22": number;
      "23": number;
      "24": number;
      "25": number;
      "26": number;
      "27": number;
      "28": number;
      "29": number;
      "34": number;
      "45569": number;
      "45570": number;
      "45571": number;
      "45572": number;
      "45573": number;
      "45574": number;
      "45575": number;
      "45576": number;
      "45577": number;
      "45578": number;
      "45579": number;
      "45580": number;
      "45581": number;
      "45582": number;
      "45583": number;
      "45584": number;
      "45585": number;
      "45586": number;
      "45587": number;
      "45588": number;
      "45589": number;
      "45590": number;
      "45591": number;
      "45592": number;
      "45593": number;
      "45594": number;
      "45595": number;
      "45596": number;
      "45597": number;
      "45598": number;
      "45599": number;
      "45600": number;
      "45601": number;
      "45602": number;
      "45603": number;
      "45604": number;
      "45605": number;
      "45606": number;
      "45607": number;
      "45608": number;
      "45609": number;
      "45610": number;
      "45611": number;
      "45612": number;
      "45613": number;
      "45614": number;
      "45615": number;
      "45616": number;
      "45617": number;
      "45618": number;
      "45619": number;
      "45620": number;
      "45621": number;
      "45622": number;
      "45623": number;
      "45624": number;
      "45625": number;
      "45626": number;
      "45627": number;
      "45628": number;
      "45629": number;
      "45630": number;
      "45631": number;
      "45632": number;
      "45633": number;
      "45634": number;
      "45635": number;
      "45636": number;
      "45637": number;
      "45638": number;
      "45639": number;
      "45640": number;
      "45641": number;
      "45642": number;
      "45643": number;
      "45644": number;
      "45645": number;
      "45646": number;
      "45647": number;
      "45648": number;
      "45649": number;
      "45650": number;
      "45651": number;
      "45652": number;
      "45653": number;
      "45654": number;
      "45655": number;
      "45656": number;
      "45657": number;
      "45658": number;
      "45659": number;
      "45660": number;
      "45661": number;
      "45662": number;
      "45663": number;
      "45664": number;
      "45825": number;
      "45826": number;
      "45827": number;
      "45828": number;
      "45829": number;
      "45830": number;
      "45831": number;
      "45832": number;
      "45833": number;
      "45834": number;
      "45835": number;
      "45836": number;
      "45837": number;
      "45838": number;
      "45839": number;
      "45840": number;
      "45841": number;
      "45842": number;
      "45843": number;
      "45844": number;
      "45845": number;
      "45846": number;
      "45847": number;
      "45848": number;
      "45849": number;
      "45850": number;
      "45851": number;
      "45852": number;
      "45853": number;
      "45854": number;
      "45855": number;
      "45856": number;
      "45857": number;
      "45858": number;
      "45859": number;
      "45860": number;
      "45861": number;
      "45862": number;
      "45863": number;
      "45864": number;
      "45865": number;
      "45866": number;
      "45867": number;
      "45868": number;
      "45869": number;
      "45870": number;
      "45871": number;
      "45872": number;
      "45873": number;
      "45874": number;
      "45875": number;
      "45876": number;
      "45877": number;
      "45878": number;
      "45879": number;
      "45880": number;
      "45881": number;
      "45882": number;
      "45883": number;
      "45884": number;
      "45885": number;
      "45886": number;
      "45887": number;
      "45888": number;
      "45889": number;
      "45890": number;
      "45891": number;
      "45892": number;
      "45893": number;
      "45894": number;
      "45895": number;
      "45896": number;
      "45897": number;
      "45898": number;
      "45899": number;
      "45900": number;
      "45901": number;
      "45902": number;
      "45903": number;
      "45904": number;
      "45905": number;
      "45906": number;
      "45907": number;
      "45908": number;
      "45909": number;
      "45910": number;
      "45911": number;
      "45912": number;
      "45913": number;
      "45914": number;
      "45915": number;
      "45916": number;
      "45917": number;
      "45918": number;
      "45919": number;
      "45920": number;
      "45921": number;
      "45922": number;
      "45923": number;
      "45924": number;
      "45925": number;
      "45926": number;
      "45927": number;
      "45928": number;
      "45929": number;
      "45930": number;
      "45931": number;
      "45932": number;
      "45933": number;
      "45934": number;
      "45935": number;
      "45936": number;
      "45937": number;
      "45938": number;
      "45939": number;
      "45940": number;
      "45941": number;
      "45942": number;
      "45943": number;
      "45944": number;
      "45945": number;
      "45946": number;
      "45947": number;
      "45948": number;
      "45949": number;
      "45950": number;
      "45951": number;
      "45952": number;
      "45953": number;
      "45954": number;
      "45955": number;
      "45956": number;
      "45957": number;
      "45958": number;
      "45959": number;
      "45960": number;
      "45961": number;
      "45962": number;
      "45963": number;
      "45964": number;
      "45965": number;
      "45966": number;
      "45967": number;
      "45968": number;
      "45969": number;
      "45970": number;
      "45971": number;
      "45972": number;
      "45973": number;
      "45974": number;
      "45975": number;
      "45976": number;
      "45977": number;
      "45978": number;
      "45979": number;
      "45980": number;
      "45981": number;
      "45982": number;
      "45983": number;
      "45984": number;
      "45985": number;
      "45986": number;
      "45987": number;
      "45988": number;
      "45989": number;
      "45990": number;
      "45991": number;
      "45992": number;
      "45993": number;
      "45994": number;
      "45995": number;
      "45996": number;
      "45997": number;
      "45998": number;
      "45999": number;
      "46000": number;
      "46001": number;
      "46002": number;
      "46003": number;
      "46004": number;
      "46005": number;
      "46006": number;
      "46007": number;
      "46008": number;
      "46009": number;
      "46010": number;
      "46011": number;
      "46012": number;
      "46013": number;
      "46014": number;
      "46015": number;
      "46016": number;
      "46017": number;
      "46018": number;
      "46019": number;
      "46020": number;
      "46021": number;
      "46022": number;
      "46023": number;
      "46024": number;
      "46025": number;
      "46026": number;
      "46027": number;
      "46028": number;
      "46029": number;
      "46030": number;
      "46031": number;
      "46032": number;
      "46033": number;
      "46034": number;
      "46035": number;
      "46036": number;
      "46037": number;
      "46038": number;
      "46039": number;
      "46040": number;
      "46041": number;
      "46042": number;
      "46043": number;
      "46044": number;
      "46045": number;
      "46046": number;
      "46047": number;
      "46048": number;
      "86": number;
    };
    function encode(digest: any, code: any, length: any): any;
    function fromB58String(hash: any): any;
    function fromHexString(hash: any): any;
    function isAppCode(code: any): any;
    function isValidCode(code: any): any;
    const names: {
      "Skein1024-1000": number;
      "Skein1024-1008": number;
      "Skein1024-1016": number;
      "Skein1024-1024": number;
      "Skein1024-104": number;
      "Skein1024-112": number;
      "Skein1024-120": number;
      "Skein1024-128": number;
      "Skein1024-136": number;
      "Skein1024-144": number;
      "Skein1024-152": number;
      "Skein1024-16": number;
      "Skein1024-160": number;
      "Skein1024-168": number;
      "Skein1024-176": number;
      "Skein1024-184": number;
      "Skein1024-192": number;
      "Skein1024-200": number;
      "Skein1024-208": number;
      "Skein1024-216": number;
      "Skein1024-224": number;
      "Skein1024-232": number;
      "Skein1024-24": number;
      "Skein1024-240": number;
      "Skein1024-248": number;
      "Skein1024-256": number;
      "Skein1024-264": number;
      "Skein1024-272": number;
      "Skein1024-280": number;
      "Skein1024-288": number;
      "Skein1024-296": number;
      "Skein1024-304": number;
      "Skein1024-312": number;
      "Skein1024-32": number;
      "Skein1024-320": number;
      "Skein1024-328": number;
      "Skein1024-336": number;
      "Skein1024-344": number;
      "Skein1024-352": number;
      "Skein1024-360": number;
      "Skein1024-368": number;
      "Skein1024-376": number;
      "Skein1024-384": number;
      "Skein1024-392": number;
      "Skein1024-40": number;
      "Skein1024-400": number;
      "Skein1024-408": number;
      "Skein1024-416": number;
      "Skein1024-424": number;
      "Skein1024-432": number;
      "Skein1024-440": number;
      "Skein1024-448": number;
      "Skein1024-456": number;
      "Skein1024-464": number;
      "Skein1024-472": number;
      "Skein1024-48": number;
      "Skein1024-480": number;
      "Skein1024-488": number;
      "Skein1024-496": number;
      "Skein1024-504": number;
      "Skein1024-512": number;
      "Skein1024-520": number;
      "Skein1024-528": number;
      "Skein1024-536": number;
      "Skein1024-544": number;
      "Skein1024-552": number;
      "Skein1024-56": number;
      "Skein1024-560": number;
      "Skein1024-568": number;
      "Skein1024-576": number;
      "Skein1024-584": number;
      "Skein1024-592": number;
      "Skein1024-600": number;
      "Skein1024-608": number;
      "Skein1024-616": number;
      "Skein1024-624": number;
      "Skein1024-632": number;
      "Skein1024-64": number;
      "Skein1024-640": number;
      "Skein1024-648": number;
      "Skein1024-656": number;
      "Skein1024-664": number;
      "Skein1024-672": number;
      "Skein1024-680": number;
      "Skein1024-688": number;
      "Skein1024-696": number;
      "Skein1024-704": number;
      "Skein1024-712": number;
      "Skein1024-72": number;
      "Skein1024-720": number;
      "Skein1024-728": number;
      "Skein1024-736": number;
      "Skein1024-744": number;
      "Skein1024-752": number;
      "Skein1024-760": number;
      "Skein1024-768": number;
      "Skein1024-776": number;
      "Skein1024-784": number;
      "Skein1024-792": number;
      "Skein1024-8": number;
      "Skein1024-80": number;
      "Skein1024-800": number;
      "Skein1024-808": number;
      "Skein1024-816": number;
      "Skein1024-824": number;
      "Skein1024-832": number;
      "Skein1024-840": number;
      "Skein1024-848": number;
      "Skein1024-856": number;
      "Skein1024-864": number;
      "Skein1024-872": number;
      "Skein1024-88": number;
      "Skein1024-880": number;
      "Skein1024-888": number;
      "Skein1024-896": number;
      "Skein1024-904": number;
      "Skein1024-912": number;
      "Skein1024-920": number;
      "Skein1024-928": number;
      "Skein1024-936": number;
      "Skein1024-944": number;
      "Skein1024-952": number;
      "Skein1024-96": number;
      "Skein1024-960": number;
      "Skein1024-968": number;
      "Skein1024-976": number;
      "Skein1024-984": number;
      "Skein1024-992": number;
      "Skein256-104": number;
      "Skein256-112": number;
      "Skein256-120": number;
      "Skein256-128": number;
      "Skein256-136": number;
      "Skein256-144": number;
      "Skein256-152": number;
      "Skein256-16": number;
      "Skein256-160": number;
      "Skein256-168": number;
      "Skein256-176": number;
      "Skein256-184": number;
      "Skein256-192": number;
      "Skein256-200": number;
      "Skein256-208": number;
      "Skein256-216": number;
      "Skein256-224": number;
      "Skein256-232": number;
      "Skein256-24": number;
      "Skein256-240": number;
      "Skein256-248": number;
      "Skein256-256": number;
      "Skein256-32": number;
      "Skein256-40": number;
      "Skein256-48": number;
      "Skein256-56": number;
      "Skein256-64": number;
      "Skein256-72": number;
      "Skein256-8": number;
      "Skein256-80": number;
      "Skein256-88": number;
      "Skein256-96": number;
      "Skein512-104": number;
      "Skein512-112": number;
      "Skein512-120": number;
      "Skein512-128": number;
      "Skein512-136": number;
      "Skein512-144": number;
      "Skein512-152": number;
      "Skein512-16": number;
      "Skein512-160": number;
      "Skein512-168": number;
      "Skein512-176": number;
      "Skein512-184": number;
      "Skein512-192": number;
      "Skein512-200": number;
      "Skein512-208": number;
      "Skein512-216": number;
      "Skein512-224": number;
      "Skein512-232": number;
      "Skein512-24": number;
      "Skein512-240": number;
      "Skein512-248": number;
      "Skein512-256": number;
      "Skein512-264": number;
      "Skein512-272": number;
      "Skein512-280": number;
      "Skein512-288": number;
      "Skein512-296": number;
      "Skein512-304": number;
      "Skein512-312": number;
      "Skein512-32": number;
      "Skein512-320": number;
      "Skein512-328": number;
      "Skein512-336": number;
      "Skein512-344": number;
      "Skein512-352": number;
      "Skein512-360": number;
      "Skein512-368": number;
      "Skein512-376": number;
      "Skein512-384": number;
      "Skein512-392": number;
      "Skein512-40": number;
      "Skein512-400": number;
      "Skein512-408": number;
      "Skein512-416": number;
      "Skein512-424": number;
      "Skein512-432": number;
      "Skein512-440": number;
      "Skein512-448": number;
      "Skein512-456": number;
      "Skein512-464": number;
      "Skein512-472": number;
      "Skein512-48": number;
      "Skein512-480": number;
      "Skein512-488": number;
      "Skein512-496": number;
      "Skein512-504": number;
      "Skein512-512": number;
      "Skein512-56": number;
      "Skein512-64": number;
      "Skein512-72": number;
      "Skein512-8": number;
      "Skein512-80": number;
      "Skein512-88": number;
      "Skein512-96": number;
      "blake2b-104": number;
      "blake2b-112": number;
      "blake2b-120": number;
      "blake2b-128": number;
      "blake2b-136": number;
      "blake2b-144": number;
      "blake2b-152": number;
      "blake2b-16": number;
      "blake2b-160": number;
      "blake2b-168": number;
      "blake2b-176": number;
      "blake2b-184": number;
      "blake2b-192": number;
      "blake2b-200": number;
      "blake2b-208": number;
      "blake2b-216": number;
      "blake2b-224": number;
      "blake2b-232": number;
      "blake2b-24": number;
      "blake2b-240": number;
      "blake2b-248": number;
      "blake2b-256": number;
      "blake2b-264": number;
      "blake2b-272": number;
      "blake2b-280": number;
      "blake2b-288": number;
      "blake2b-296": number;
      "blake2b-304": number;
      "blake2b-312": number;
      "blake2b-32": number;
      "blake2b-320": number;
      "blake2b-328": number;
      "blake2b-336": number;
      "blake2b-344": number;
      "blake2b-352": number;
      "blake2b-360": number;
      "blake2b-368": number;
      "blake2b-376": number;
      "blake2b-384": number;
      "blake2b-392": number;
      "blake2b-40": number;
      "blake2b-400": number;
      "blake2b-408": number;
      "blake2b-416": number;
      "blake2b-424": number;
      "blake2b-432": number;
      "blake2b-440": number;
      "blake2b-448": number;
      "blake2b-456": number;
      "blake2b-464": number;
      "blake2b-472": number;
      "blake2b-48": number;
      "blake2b-480": number;
      "blake2b-488": number;
      "blake2b-496": number;
      "blake2b-504": number;
      "blake2b-512": number;
      "blake2b-56": number;
      "blake2b-64": number;
      "blake2b-72": number;
      "blake2b-8": number;
      "blake2b-80": number;
      "blake2b-88": number;
      "blake2b-96": number;
      "blake2s-104": number;
      "blake2s-112": number;
      "blake2s-120": number;
      "blake2s-128": number;
      "blake2s-136": number;
      "blake2s-144": number;
      "blake2s-152": number;
      "blake2s-16": number;
      "blake2s-160": number;
      "blake2s-168": number;
      "blake2s-176": number;
      "blake2s-184": number;
      "blake2s-192": number;
      "blake2s-200": number;
      "blake2s-208": number;
      "blake2s-216": number;
      "blake2s-224": number;
      "blake2s-232": number;
      "blake2s-24": number;
      "blake2s-240": number;
      "blake2s-248": number;
      "blake2s-256": number;
      "blake2s-32": number;
      "blake2s-40": number;
      "blake2s-48": number;
      "blake2s-56": number;
      "blake2s-64": number;
      "blake2s-72": number;
      "blake2s-8": number;
      "blake2s-80": number;
      "blake2s-88": number;
      "blake2s-96": number;
      "dbl-sha2-256": number;
      id: number;
      "keccak-224": number;
      "keccak-256": number;
      "keccak-384": number;
      "keccak-512": number;
      "murmur3-128": number;
      "murmur3-32": number;
      sha1: number;
      "sha2-256": number;
      "sha2-512": number;
      "sha3-224": number;
      "sha3-256": number;
      "sha3-384": number;
      "sha3-512": number;
      "shake-128": number;
      "shake-256": number;
    };
    function prefix(multihash: any): any;
    function toB58String(hash: any): any;
    function toHexString(hash: any): any;
    function validate(multihash: any): void;
  }
}
