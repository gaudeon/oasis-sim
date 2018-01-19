import ParseNode from './parse-node';

export default class ParseTree {
    constructor {
        this._root = new ParseNode();
    }

    static nodesDepthFirst (callback, root) {
        if (typeof callback !== 'function') {
            callback = () => {};
        }

        (function recurse (node) {
            node.children.forEach(child => { recurse(child); });

            callback(node);
        })(root);
    }

    static nodesBreadthFirst (callback, root) {
        if (typeof callback !== 'function') {
            callback = () => {};
        }

        (function recurse (nodes) {
            var nextNodes = [];

            nodes.forEach(child => { callback(child); nextNodes.concat(child.children); });

            if (nextNodes.length > 0) {
                recurse(nextNodes);
            }
        })([root]);
    }

    get root () { return this._root; }

    get contains (data, search = ParseTree.nodesDepthFirst) {
        if (typeof data !== 'function') {
            data = d => { return d === data; };
        }

        search(data, this.root);
    }

    add (child, parent) {
        // TODO: finish this
    }

    remove (node, parent) {
        // TODO: finish this
    }
}
