export const categoryDataShape = {
  values: 'values',
  ranks: 'ranks',
  series: 'series',
} as const;

export const categoryRendererKey = {
  metricCard: 'metricCard',
  entityMetricList: 'entityMetricList',
  horizontalRanking: 'horizontalRanking',
  lineChart: 'lineChart',
  dataTable: 'dataTable',
  distributionChart: 'distributionChart',
  scatterPlot: 'scatterPlot',
} as const;

export type CategoryDataShape = (typeof categoryDataShape)[keyof typeof categoryDataShape];
export type CategoryRendererKey = (typeof categoryRendererKey)[keyof typeof categoryRendererKey];
export type StatisticRendererDataShape =
  (typeof statisticRendererDataShape)[keyof typeof statisticRendererDataShape];

export const statisticRendererDataShape = {
  metricCard: categoryDataShape.values,
  entityMetricList: categoryDataShape.values,
  horizontalRanking: categoryDataShape.ranks,
  lineChart: categoryDataShape.series,
  dataTable: categoryDataShape.ranks,
  distributionChart: categoryDataShape.values,
  scatterPlot: categoryDataShape.series,
} as const satisfies Record<CategoryRendererKey, CategoryDataShape>;
