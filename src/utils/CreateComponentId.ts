const CreateComponentId = (reference: string, uniqueReference: string, options?: { genRandomId?: boolean }) => `${reference}-${uniqueReference}`;

export default CreateComponentId;