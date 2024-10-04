// import { checkA11y, configureAxe, injectAxe } from 'axe-playwright';
// import { getStoryContext } from '@storybook/test-runner';
//
// export default {
//   async preVisit(page) {
//     await injectAxe(page);
//   },
//   async postVisit(page, context) {
//     const storyContext = await getStoryContext(page, context);
//
//     await configureAxe(page, {
//       rules: storyContext.parameters?.a11y?.config?.rules,
//     });
//
//     await checkA11y(page, '#storybook-root', {
//       detailedReport: true,
//       detailedReportOptions: {
//         html: true,
//       },
//     });
//   },
// };
