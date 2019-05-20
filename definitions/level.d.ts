export = level;
declare function level(location: any, options?: any, callback?: any): any;
declare namespace level {
  function destroy(location: any, callback: any): void;
  namespace errors {
    class EncodingError {
      constructor(message: any, cause: any);
      code: any;
      path: any;
      errno: any;
      message: any;
    }
    class InitializationError {
      constructor(message: any, cause: any);
      code: any;
      path: any;
      errno: any;
      message: any;
    }
    class LevelUPError {
      constructor(message: any, cause: any);
      code: any;
      path: any;
      errno: any;
      message: any;
    }
    class NotFoundError {
      constructor(message: any, cause: any);
      code: any;
      path: any;
      errno: any;
      message: any;
    }
    class OpenError {
      constructor(message: any, cause: any);
      code: any;
      path: any;
      errno: any;
      message: any;
    }
    class ReadError {
      constructor(message: any, cause: any);
      code: any;
      path: any;
      errno: any;
      message: any;
    }
    class WriteError {
      constructor(message: any, cause: any);
      code: any;
      path: any;
      errno: any;
      message: any;
    }
  }
  function repair(location: any, callback: any): void;
}
