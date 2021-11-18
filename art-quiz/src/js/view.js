export class View {
  constructor({ viewName, funcs }) {
    if (!viewName || !funcs?.render) throw new Error('You must pass required arguments in View constructor');
    this.viewName = viewName;
    this.data = {};
    this.funcs = {
      beforeLoad: [],
      afterLoad: [],
      render: funcs.render
    };
    if (funcs.beforeLoad) this.funcs.beforeLoad.push(...funcs.beforeLoad);
    if (funcs.afterLoad) this.funcs.afterLoad.push(...funcs.afterLoad);
  }

  async getTemplate() {
    if (!this.template) this.template = await (await fetch(`/views/${this.viewName}.html`)).text();
    return this.template;
  }

  async getFormattedTemplate(parameters) {
    return this.funcs.render.apply(this, [parameters]);
  }

  runFuncs(stage, parameters) {
    return Promise.all(this.funcs[stage].map((func) => func.apply(this, [parameters])));
  }
}
