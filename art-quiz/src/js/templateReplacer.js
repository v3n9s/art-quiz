export const templateReplacer = {
  replace(template, context) {
    if (!template) return '';
    return Object.values(template.match(/(?<={{).*?(?=}})/g))
      .reduce((str, key) => {
        return str.replace(`{{${key}}}`, context[key]);
      }, template);
  }
};
