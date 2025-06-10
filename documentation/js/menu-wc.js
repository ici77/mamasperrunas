'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BannerComponent.html" data-type="entity-link" >BannerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BannerportadaComponent.html" data-type="entity-link" >BannerportadaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogComponent.html" data-type="entity-link" >BlogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogComponent-1.html" data-type="entity-link" >BlogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogLayoutComponent.html" data-type="entity-link" >BlogLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CalendarioEventosComponent.html" data-type="entity-link" >CalendarioEventosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CategoryForoComponent.html" data-type="entity-link" >CategoryForoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CategoryPageComponent.html" data-type="entity-link" >CategoryPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChatbotComponent.html" data-type="entity-link" >ChatbotComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CircleGridComponent.html" data-type="entity-link" >CircleGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CommunityComponent.html" data-type="entity-link" >CommunityComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConsejosComponent.html" data-type="entity-link" >ConsejosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CrearEventoComponent.html" data-type="entity-link" >CrearEventoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CrearPostComponent.html" data-type="entity-link" >CrearPostComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetalleEventoComponent.html" data-type="entity-link" >DetalleEventoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DogBreedsComponent.html" data-type="entity-link" >DogBreedsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DogListComponent.html" data-type="entity-link" >DogListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EventosComponent.html" data-type="entity-link" >EventosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExpertsComponent.html" data-type="entity-link" >ExpertsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterComponent.html" data-type="entity-link" >FooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ForumGridComponent.html" data-type="entity-link" >ForumGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GridComponent.html" data-type="entity-link" >GridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LandingPageComponent.html" data-type="entity-link" >LandingPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LifeComponent.html" data-type="entity-link" >LifeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LocalizacionComponent.html" data-type="entity-link" >LocalizacionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewsComponent.html" data-type="entity-link" >NewsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PerfilComponent.html" data-type="entity-link" >PerfilComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PostDetailComponent.html" data-type="entity-link" >PostDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductListComponent.html" data-type="entity-link" >ProductListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileComponent.html" data-type="entity-link" >ProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegistroComponent.html" data-type="entity-link" >RegistroComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DogApiService.html" data-type="entity-link" >DogApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventService.html" data-type="entity-link" >EventService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ForumService.html" data-type="entity-link" >ForumService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HolaMundoService.html" data-type="entity-link" >HolaMundoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostService.html" data-type="entity-link" >PostService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostService-1.html" data-type="entity-link" >PostService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuarioService.html" data-type="entity-link" >UsuarioService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Dog.html" data-type="entity-link" >Dog</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Evento.html" data-type="entity-link" >Evento</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PerfilUsuario.html" data-type="entity-link" >PerfilUsuario</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});