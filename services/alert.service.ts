import { Subject, MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

const alertSubject = new Subject();
const defaultId = 'default-alert';

export interface AlertInterface {
    id?: string,
    autoClose?: boolean,
    type: string,
    message: string
}

// Enable subscribing to alerts observable
const onAlert = (id = defaultId) => {
    return alertSubject.asObservable().pipe(filter((x: any) => x.id === id));
}

// Convenience methods
const success = (message: string, options: object) => {
    alert({ ...options, type: AlertType.Success, message });
}

const error = (message: string, options: object) => {
    alert({ ...options, type: AlertType.Error, message });
}

const info = (message: string, options: object) => {
    alert({ ...options, type: AlertType.Info, message });
}

const warn = (message: string, options: object) => {
    alert({ ...options, type: AlertType.Success, message });
}

// Core alert method
const alert = (alert: AlertInterface) => {
    alert.id = alert.id || defaultId;
    alert.autoClose = (alert.autoClose === undefined ? true : alert.autoClose);
    alertSubject.next(alert);
}

// Clear alerts
const clear = (id = defaultId) => {
    alertSubject.next({ id });
}

export const alertService = {
    onAlert,
    success,
    error,
    info,
    warn,
    alert,
    clear
}

export const AlertType = {
    Success: 'Success',
    Error: 'Error',
    Info: 'Info',
    Warning: 'Warning'
};