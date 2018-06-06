import { Element } from "../../html-element";
import { h } from "../../api";
import { createElement } from "../../upgrade";
import { ViewModelReflection } from "../../utils";
import { VM } from "../../vm";
import { Component } from "../../component";

describe('root', () => {
    describe('integration', () => {

        it.skip('should support this.template.host', () => {
            class MyComponent extends Element {}
            const elm = createElement('x-foo', { is: MyComponent });
            const vm = elm[ViewModelReflection] as VM;
            expect(vm.component).toBe(elm.shadowRoot.host);
        });

        it('should support this.template.mode', () => {
            class MyComponent extends Element {}
            const elm = createElement('x-foo', { is: MyComponent });
            expect(elm.shadowRoot.mode).toBe('closed');
        });

        it('should allow searching for elements from template', () => {
            function html($api) { return [$api.h('p', { key: 0 }, [])]; }
            class MyComponent extends Element {
                render() {
                    return html;
                }
            }
            const elm = createElement('x-foo', { is: MyComponent });
            document.body.appendChild(elm);
            return Promise.resolve().then(() => {
                const nodes = elm.shadowRoot.querySelectorAll('p');
                expect(nodes).toHaveLength(1);
            });
        });

        it('should allow searching for one element from template', () => {
            function html($api) {
                return [$api.h('p', { key: 0 }, [])];
            }
            class MyComponent extends Element {
                render() {
                    return html;
                }
            }
            const elm = createElement('x-foo', { is: MyComponent });
            document.body.appendChild(elm);
            return Promise.resolve().then(() => {
                const node = elm.shadowRoot.querySelector('p');
                expect(node.tagName).toBe('P');
            });
        });

        it('should ignore elements from other owner', () => {
            const vnodeFromAnotherOwner = h('p', { key: 0 }, []);
            function html() { return [vnodeFromAnotherOwner]; }
            class MyComponent extends Element {
                render() {
                    return html;
                }
            }
            const elm = createElement('x-foo', { is: MyComponent });
            document.body.appendChild(elm);
            return Promise.resolve().then(() => {
                const nodes = elm.shadowRoot.querySelectorAll('p');
                expect(nodes).toHaveLength(0);
            });
        });

        it('should ignore element from other owner', () => {
            const vnodeFromAnotherOwner = h('p', { key: 0 }, []);
            function html() { return [vnodeFromAnotherOwner]; }
            class MyComponent extends Element {
                render() {
                    return html;
                }
            }
            const elm = createElement('x-foo', { is: MyComponent });
            document.body.appendChild(elm);
            return Promise.resolve().then(() => {
                const node = elm.shadowRoot.querySelector('p');
                expect(node).toBeNull();
            });
        });

    });

    describe('childNodes', () => {
        it('should return array of childnodes', () => {
            function tmpl($api) {
                return [
                    $api.h('div', {
                        key: 0,
                    }, [
                        $api.h('span', {
                            key: 1,
                        } , []),
                    ]),
                    $api.h('p', {
                        key: 2,
                    } , [

                    ]),
                ];
            }
            class MyComponent extends Element {
                render() {
                    return tmpl;
                }
            }

            const elem = createElement('x-shadow-child-nodes', { is: MyComponent });
            document.body.appendChild(elem);
            const children = elem.shadowRoot.childNodes;
            expect(children).toHaveLength(2);
            expect(children[0]).toBe(elem.shadowRoot.querySelector('div'));
            expect(children[1]).toBe(elem.shadowRoot.querySelector('p'));
        });
    });
});
