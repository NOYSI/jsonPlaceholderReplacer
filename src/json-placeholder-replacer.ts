export class JsonPlaceholderReplacer {
    private variablesMap: {}[] = [];

    public addVariableMap(variableMap: object | string): JsonPlaceholderReplacer {
        if (typeof variableMap == 'string') {
            this.variablesMap.unshift(JSON.parse(variableMap));
        } else {
            this.variablesMap.unshift(variableMap);
        }
        return this;
    }

    public replace(json: object | string): {} {
        if (typeof json == 'string') {
            return this.replaceChildren(JSON.parse(json));
        } else {
            return this.replaceChildren(json);
        }
    }

    private replaceChildren = (node: any): {} => {
        for (const key in node) {
            const attribute = node[key];
            if (typeof attribute == 'object') {
                node[key] = this.replaceChildren(attribute);
            } else {
                node[key] = this.replaceValue(attribute.toString());
            }
        }
        return node;
    }

    private replaceValue(node: string): any {
        let replacer = (placeHolder: string): string => {
            const key: string = placeHolder.substr(2, placeHolder.length - 4);
            let inEveryMap = this.checkInEveryMap(key);
            return inEveryMap !== undefined ? inEveryMap : placeHolder;
        };
        let output = node.replace(/{{[^}}]+}}/g, replacer)
                        .replace(/<<[^>>]+>>/g, replacer);
        try {
            return JSON.parse(output);
        }
        catch (exc) {
            return output;
        }
    }

    private checkInEveryMap(key: string): string | undefined {
        let map: any = {};
        for (map of this.variablesMap) {
            const variableValue: any = map[key];

            if (variableValue !== undefined) {
                if (typeof variableValue == 'object') {
                    return JSON.stringify(variableValue);
                }
                return variableValue;
            }
        }
    }
}