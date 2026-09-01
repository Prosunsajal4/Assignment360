export const success = <T>(data: T, message='Success') => ({ success: true, message, data });
export const failure = (message='Error', errors: unknown=null) => ({ success: false, message, errors });
