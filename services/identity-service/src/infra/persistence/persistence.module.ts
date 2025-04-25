import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, DynamicModule, Provider, ClassProvider } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

@Module({})
export class PersistenceModule {
  /**
   * @param entities Array de classes de entidade ORM (ex: UserOrm, OrderOrm)
   * @param providers Array de providers, cada um deve ser ou um ClassProvider ({ provide, useClass }) ou uma classe
   */
  static forFeature(
    entities: (new () => any)[],
    providers: Provider[],
  ): DynamicModule {
    // Verifica se o providers é um array de ClassProvider ou classes simples
    const exportsProviders = providers.map((p) =>
      typeof p === 'object' && 'provide' in p
        ? (p as ClassProvider).provide
        : p,
    );

    return {
      module: PersistenceModule,
      imports: [DatabaseModule, TypeOrmModule.forFeature(entities)],
      providers,
      exports: exportsProviders,
    };
  }
}
