interface omitProps {
    obj: object;
}

export const omit = ( obj:omitProps , key:(keyof omitProps) ) => {
    const { [key]: omitted, ...rest } = obj;
    return rest;
}