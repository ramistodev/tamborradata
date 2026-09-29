import { PeriodKind, periodKind } from '../period.types';
import { statisticCategories, StatisticCategories } from './category.types';
import {
  categoryDataShape,
  CategoryRendererKey,
  categoryRendererKey,
  statisticRendererDataShape,
} from './data-shape.types';

export type StatisticCategoryPresentation = {
  [RendererKey in CategoryRendererKey]: {
    dataShape: (typeof statisticRendererDataShape)[RendererKey];
    rendererKey: RendererKey;
  };
}[CategoryRendererKey];

export type StatisticCategoryPeriodConfig = Readonly<
  Record<StatisticCategories, Readonly<Partial<Record<PeriodKind, StatisticCategoryPresentation>>>>
>;

export const statisticCategoryPeriodConfig = {
  [statisticCategories.totalParticipants]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.participantsGrowthRate]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.series,
      rendererKey: categoryRendererKey.lineChart,
    },
  },
  [statisticCategories.participationRecordYears]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.topNames]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.namesDiversity]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.nameTrends]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.series,
      rendererKey: categoryRendererKey.lineChart,
    },
  },
  [statisticCategories.newNames]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.disappearedNames]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.perennialNames]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.nameComebacks]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.averageNameLength]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.nameInitialDistribution]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.series,
      rendererKey: categoryRendererKey.lineChart,
    },
  },
  [statisticCategories.nameConcentration]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.singleYearNames]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.rareNames]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.longestNames]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.nameSchoolCorrelation]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.topSecondNames]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.participantsWithMultipleNames]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.topSurnames]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.surnamesDiversity]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.surnameTrends]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.series,
      rendererKey: categoryRendererKey.lineChart,
    },
  },
  [statisticCategories.newSurnames]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.disappearedSurnames]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.perennialSurnames]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.surnameComebacks]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.averageSurnameLength]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.surnameInitialDistribution]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.series,
      rendererKey: categoryRendererKey.lineChart,
    },
  },
  [statisticCategories.surnameConcentration]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.singleYearSurnames]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.rareSurnames]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.longestSurnames]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.surnameSchoolCorrelation]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.nameSurnameDynasties]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.topSchools]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.newSchools]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.disappearedSchools]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.schoolLongevity]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.schoolGrowthRate]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.series,
      rendererKey: categoryRendererKey.lineChart,
    },
  },
  [statisticCategories.averageSchoolSize]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
  [statisticCategories.schoolNameDiversity]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.schoolSurnameDiversity]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.commonNameBySchool]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.dataTable,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.dataTable,
    },
  },
  [statisticCategories.commonSurnameBySchool]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.dataTable,
    },
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.dataTable,
    },
  },
  [statisticCategories.schoolsEvolution]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.series,
      rendererKey: categoryRendererKey.lineChart,
    },
  },
  [statisticCategories.mostConstantSchools]: {
    [periodKind.global]: {
      dataShape: categoryDataShape.ranks,
      rendererKey: categoryRendererKey.horizontalRanking,
    },
  },
  [statisticCategories.newVsVeteranSchoolRatio]: {
    [periodKind.year]: {
      dataShape: categoryDataShape.values,
      rendererKey: categoryRendererKey.metricCard,
    },
  },
} as const satisfies StatisticCategoryPeriodConfig;

type PeriodConfig = typeof statisticCategoryPeriodConfig;

export type PresentationsFor<C extends StatisticCategories> = C extends StatisticCategories
  ? {
      [K in keyof PeriodConfig[C]]: PeriodConfig[C][K] extends StatisticCategoryPresentation
        ? PeriodConfig[C][K]
        : never;
    }[keyof PeriodConfig[C]]
  : never;

export type ShapesFor<C extends StatisticCategories> =
  PresentationsFor<C> extends {
    dataShape: infer Shape;
  }
    ? Shape
    : never;

export type ShapeFor<
  C extends StatisticCategories,
  K extends PeriodKind,
> = K extends keyof PeriodConfig[C]
  ? PeriodConfig[C][K] extends { dataShape: infer Shape }
    ? Shape
    : never
  : never;
