# Ensure that the CSF title matches the file directory

Check that all CSF titles are valid, i.e. matches the directory in which they belong.

## Rule Details

This rule ensures the storybook hierarchy matches the filesystem hierarchy.

The following pattern is warning:

```js
// Client/js/core/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.stories.js
export default {
    component: ForecastCellInfoWidget,
    title: "accounting/widgets/ForecastCellInfoWidget",
};
```

The following pattern is not warning:

```js
// Client/js/accounting/widgets/ForecastCellInfoWidget/ForecastCellInfoWidget.stories.js
export default {
    component: ForecastCellInfoWidget,
    title: "accounting/widgets/ForecastCellInfoWidget",
};

```
