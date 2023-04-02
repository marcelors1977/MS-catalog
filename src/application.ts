import {BootMixin} from '@loopback/boot';
import {Application, ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {RabbitmqServer} from './servers';
import {RestBindings, RestComponent, RestServer} from '@loopback/rest';
import {
  EntityComponent,
  RestExplorerComponent,
  ValidatorComponent,
} from './components';
import {RestExplorerBindings} from '@loopback/rest-explorer';
import {ApiResourceProvider} from './providers/api-resource.provider';

export class MicroCatalogApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(Application)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    options.rest.sequence = MySequence;
    this.component(RestComponent);
    const restServer = this.getSync<RestServer>('servers.RestServer');
    restServer.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.bind(RestBindings.SequenceActions.SEND).toProvider(
      ApiResourceProvider,
    );
    this.component(RestExplorerComponent);
    this.component(ValidatorComponent);
    this.component(EntityComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.servers([RabbitmqServer]);
  }

  async boot() {
    await super.boot();
    //   const genderRepo = this.getSync('repositories.GenderRepository');
    //   //@ts-ignore
    //   genderRepo.attachRelation(

    //     {
    //       id: '1-cat',
    //       name: 'filme111',
    //       is_active: true
    //     });
  }
}
