import { templateReplacer } from './templateReplacer.js';

export class View {
  constructor({ viewName, funcs }) {
    if (!viewName || !funcs?.getContext) throw new Error('You must pass required arguments in View constructor');
    this.viewName = viewName;
    this.funcs = funcs;
  }

  async getTemplate() {
    if (!this.template) this.template = await (await fetch(`./views/${this.viewName}.html`)).text();
    return this.template;
  }

  async getFormattedTemplate(args) {
    return templateReplacer.replace(await this.getTemplate(), await this.runFunc('getContext', args));
  }

  runFunc(name, args) {
    return this.funcs[name]?.apply(this, [args]);
  }
}
