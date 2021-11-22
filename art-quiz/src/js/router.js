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

    this.routerElem = document.querySelector('#router');
    this.overlayElem = document.querySelector('.loading__overlay');
    this.loadingAnimationElem = document.querySelector('.loading__animation');
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

    let transition = this.showLoading();
    const { view } = await import(`./views/${viewName}.js`);
    await view.runFunc('beforeLoad', { parameters });
    [document.querySelector('#router').innerHTML] = await Promise.all([view.getFormattedTemplate({ parameters }), await transition]);
    await this.waitForImages();
    this.hideLoading();
    view.runFunc('afterLoad', { parameters });
  }

  async showLoading() {
    this.overlayElem.style.opacity = '1';
    this.overlayElem.style.pointerEvents = 'all';
    if (document.querySelectorAll('img').length) {
      const images = document.querySelectorAll('img');
      this.loadingAnimationElem.style.backgroundColor = 'transparent';
      this.loadingAnimationElem.style.backgroundImage = `url(${images[Math.floor(Math.random() * images.length)].src})`;
    }
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 500);
    });
  }

  hideLoading() {
    this.overlayElem.style.opacity = '0';
    this.overlayElem.style.pointerEvents = 'none';
  }

  async waitForImages() {
    return Promise.all([...this.routerElem.querySelectorAll('img')].map((elem) => {
      return new Promise((res) => {
        elem.addEventListener('load', () => res());
      });
    }));
  }
}

export const router = new Router();
