class Router {
  constructor() {
    this.routes = {
      category: /(?<route>topics\/(?<topic>.+)\/categories\/(?<category>.+))\/rounds\/(?<roundInd>.+)/,
      categories: /(?<route>topics\/(?<topic>.+))/,
      results: /(?<route>results)/,
      menu: /(?<route>.*)/
    };

    window.addEventListener('hashchange', () => {
      this.getView(window.location.hash.slice(1));
    });

    window.dispatchEvent(new Event('hashchange'));
  }

  async getView(hash) {
    let parameters;

    const viewName = (() => {
      return Object.keys(this.routes)[
        Object.values(this.routes)
          .findIndex((routeRegExp) => {
            parameters = hash.match(routeRegExp)?.groups;
            return parameters?.route !== undefined;
          })
      ];
    })();

    const { view } = await import(`./views/${viewName}.js`);
    await view.runFunc('beforeLoad', { parameters });
    document.querySelector('#router').innerHTML = await view.getFormattedTemplate({ parameters });
    view.runFunc('afterLoad', { parameters });
  }
}

export const router = new Router();
