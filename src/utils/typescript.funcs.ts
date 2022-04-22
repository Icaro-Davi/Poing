// export type Modify<T, R> = Omit<T, keyof R> & R;
export type Modify<T, R> = Record<keyof T, R>;
