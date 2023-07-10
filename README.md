## Development server

Run `pnpm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `pnpm build` to build the project. The build artifacts will be stored in the `dist/` directory.

Run `pnpm start:prod` to serve the production build locally to port 8080.

Run `pnpm build:serve` to build and then serve the production build locally.

---

For a full working example of the concepts in this article see the [github](https://github.com/dmoriley-r/angular-dynamic-renderer). The most important files to look at would be:

- dynamic-componente-manifest.ts
- render-template.component.ts
- dynamic-component.service.ts

#### What is dynamic rendering with Angular

For the most part web apps will have pages that have their structures predefined. The pages may be dynamic based on user data or predefined conditions but the structure of the web pages for the different permutations are setup before hand. Dynamic rendering involves using components that the angular engine will build at runtime. With dynamic rendering, a webpage doesn't have its structure setup before hand. Using specially defined components a webpage can be structurally defined at at data source like a content management system (CMS) and then have that structure rendered dynamically at runtime.

#### Why use dynamic rendering

Using dynamic rendering empowers websites to be driven by a data source like a CMS. After having the dynamic rendering pipeline setup by the developers the structure of the webpages can be authored by business and content writers with quick turn around. Instead of only being able to define text context within fixed areas of the page, the author can update text content but also the structure of the webpage itself without having to go through the whole build and deploy cycle. Using dynamic rendering is like using a markdown interpreter. By building a dynamic rendering pipeline, you are building a markdown language that your render pipeline can dynamically parse and render at runtime.

#### Angular implementation challenges

Implementing dynamic rendering in Angular has some challenges itself. Dynamic rendering is a manual process and operations normally handled by Angular need to be handled by the dynamic rendering pipeline. This includes manually compiling components, attaching them to the view and cleaning up after the dynamic components. A library like React has an easier time of this because it only needs the desired JSX as the result, which is easy to achieve with a simple map object. Angular can't just pass the component as defined in its class file. Those class definitions need to be complied correctly and then manually attached to the correct view so that its rendered where expected. One other challenge of this flow is the introduction of standalone components. Angular now has module based and standalone components and each are compiled differently.

#### Building a pipeline

The happy path of dynamic rendering consists of three main parts. First is receiving the components that are to be rendered, whether that be from a CMS or a regular REST endpoint, and passing them to the component responsible for rendering them. The second step is to take that information and match it with a component that has been predefined. In the third step, the classes and modules are processed into components that angular can use and in the final step these components are simply attached to the view of the application which renders them on the DOM.

> Pipeline happy path:
> Receive components to render -> load component information -> create component and attach custom properties -> component attached to view

##### Setting up to receive components

In the first step we need to get a JSON response from a source, whether that be a CMS or REST endpoint. This could be done on a component's `ngOnInit` life cycle method or we could take advantage of angular route resolver functions. Using a route resolver the page data required will be fetched before navigating to the new route. This example application uses route resolvers.

```typescript
// routeDataResolver.ts
export const routeDataResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const httpClient = inject(HttpClient);
  const router = inject(Router);
  // #2 YOUR_URL could be a call to a CMS or REST endpoint
  return httpClient.get([YOUR_URL]).pipe(
    catchError((_) => {
      // #3 redirected on error to not found
      router.navigateByUrl('/not-found');
      return EMPTY;
    })
  );
};

// app-routing.module.ts
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    // #1 home route
    path: 'home',
    component: HomeComponent,
    resolve: { pageData: routeDataResolver },
  },
  {
    path: 'post/:id',
    component: PostComponent,
    resolve: { pageData: routeDataResolver },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
```

When navigating to the #1 home route or a page with post, before navigation, the application is going to request data via the routeDataResolver. If the request is #2 successful it will continue with navigation, but if for whatever reason an error is throw the user will be #3 redirected to the not found page.

```typescript
// home.component.ts
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="pageData$ | async as pageData">
      <!-- #5 pass data to components input -->
      <app-render-template [components]="pageData.children" />
    </ng-container>
  `,
})
export class HomeComponent {
  // #4 mapping observable data and extract pageData
  pageData$ = this.activatedRoute.data.pipe(map(({ pageData }) => pageData));

  constructor(private activatedRoute: ActivatedRoute) {}
}
```

Now in our home page we can access the data we requested by injecting the `ActivatedRoute`. We can find the information by #4 mapping the observable data property and extracting the key name we specified in the route resolve object. In this case it was `{ pageData: routeDataResolver }`, so we would expect the information to be on `pageData`. Then we pass #5 the data to the `app-render-template` 'components' input property. The `app-render-template` is the start of the dynamic rendering pipeline.

##### Load component information

Now that we have our list of components we would like to appear on this page we need to map those component names to the their respective component classes and modules. To start we need a component manifest of all the available dynamic components we've made available to the pipeline. The #6 manifest is an object with keys that need to match exactly with the component names on the #7 JSON response we received when we navigated to a page.

```typescript
// dynamic-component-manifest.ts
const dynamicComponentMap: ComponentMap = {
// #6 component manifest object
  pageContainer: {
    loadComponent: () =>
      import('../../dynamic-components/page-container').then(
        (m) => m.PageContainerModule as Type<DynamicModule>
      ),
  },
  pageSection: {
    loadComponent: () =>
      import('../../dynamic-components/page-section').then(
        (m) => m.PageSectionModule as Type<DynamicModule>
      ),
  },
  postPreview: {
	// #13 lazy load component
    loadComponent: () =>
      import('../../dynamic-components/post-preview').then(
        (m) => m.PostPreviewComponent as Type<DynamicComponent>
      ),
  },
};

// #7 example json response
{
  "header": "Dynamic Renderer",
  // #8 array of dynamic components, same as other children arrays
  "children": [
    {
      // #9 name of dynamic component to render
      "name": "pageContainer",
      "componentData": {
        "children": [
          {
            "name": "pageSection",
            "componentData": {
              "children": [
                {
                  "name": "postPreview",
                  "componentData": {
                    "title": "When a tree falls in the forest what happens?",
                    "subtitle": "The forest critters loose a long time friend but gain a new one",
                    "shortName": "trees",
                    "author": "Lars Hoff",
                    "dateAsString": "May 31, 2023"
                  }
                }
                ...

```

The #8 `children` arrays are arrays of dynamic components we wish to render on the page. The #9 `name` properties on those objects all map directly to a key on the dynamic component #6 manifest object. Dynamic components can have `app-render-template` components nested within them so that we can have multiple levels of dynamic rendering on a page. In the case of this response, `pageContainer` is going to render `pageSection`, which in turn is going to render `postPreview`. When we have our manifest setup we can proceed with loading the component classes.

```typescript
// render-template.component.ts
  ngAfterViewInit() {
    const loadedComponentModules = this.components
	  // #10 check if component exists
      .filter((componentData) =>
        this.dynamicComponentsService.checkComponentMap(componentData)
      )
      .map(async (componentTemplate) => {
		// # 11 map from name to class
        const itemRef = await this.dynamicComponentsService.loadComponentInfo(
          componentTemplate.name
        );
        return { renderItemRef: itemRef };
      });

    this.renderComponents(loadedComponentModules);
  }
```

In the `RenderTemplateComponent`, the components are passed in through an input, and then are processed in the `ngAfterViewInit` lifecycle hook. Here the components are first #10 filtered to see if the components exist, and then are #11 mapped from their component name to component class and/or module.

```typescript
// dynamic-component.service.ts
  async loadComponentInfo(name: string) {
	// #12 use name to import correct component
    const loadedComponent = await dynamicComponentMap
      .get(name)!
      .loadComponent();

    if (!loadedComponent) {
      throw new Error(`Component not found for: ${name};`);
    }
    if (isModuleDefinition(loadedComponent)) {
	  // #14 is module based componente
      return createNgModule<DynamicModule>(loadedComponent, this.injector);
    } else {
      // # 15 stand alone component
      return loadedComponent;
    }
  }
```

In the dynamic component service, the manifest map object is used to get the component based on the name #12. Then we call the `loadComponent` method #13 we defined in the manifest object. This is going to lazy load the module over the network and return their respective classes. If the class is a module definition #14, we get angular to process the module and return it using `createNgModule`. Otherwise if its a standalone component #15, we just return the class definition directly.

##### Creating the component

In the third and final step the component class is going to be passed again to the dynamic component service where it is going to be processed by Angular into a usable component that can be rendered.

```typescript
// render-template.component.ts
  template: ` <ng-template #container></ng-template> `,
  ...
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  ...
  async renderComponents(items: Promise<LoadedRenderItems>[]) {
    const allSettledItems = await Promise.allSettled(items);
    for (let item of allSettledItems) {
      if (isFulfilled(item)) {
		// #16 pass component definition and container ref
        const newComponent = this.dynamicComponentsService.createComponent(
          this.container,
          item.value.renderItemRef
        );
		// #19 add component to refs array
        if (newComponent) {
          this.componentRefs.push(newComponent);
        }
      } else {
        // is rejected
        console.error(item.reason);
      }
    }
	// #20 tell angular to check template for changes
    this.cdr.markForCheck();
  }

// dynamic-component.service.ts

  createComponent(
    container: ViewContainerRef,
    renderItem: LoadedRenderItem
  ) {
    let componentRef: ComponentRef<any>;
	// #17 module or component definition passed to createComponent
    if (renderItem instanceof NgModuleRef) {
      componentRef = container.createComponent(renderItem.instance.entry, {
        ngModuleRef: renderItem,
      });
      // if resolver data found apply to the component
    } else {
      componentRef = container.createComponent(renderItem);
    }
	// #18 component is attached to view and rendered to DOM
    container.insert(componentRef.hostView);
    return componentRef;
  }
```

In the render-template after the promise result is fulfilled we pass the container reference and the component definition to dynamic component service #16. In the service whether its a module or standalone component they are both passed to the `createComponent` method on the `ViewContainerRef` #17. This creates our component reference. From there, the component is attached to the view by passing the component to the container insert method #18. Since the render-template is using OnPush change detection its important that after we've finished looping through each component, that we tell change detection our template is dirty and to check it for changes using `markForCheck` on our change detection reference #20. Otherwise nothing will show up.

Couple things left to do. Since we are creating dynamic components we are also now responsible for cleaning them up. After the component is created, its added to the render template component `componentRefs` array #19. Then in the `ngOnDestroy` each component needs to be destroyed manually by called their on destroy functions #21. Its also a good idea to clear the components before loading new ones back in step two.

```typescript
// render-template.component.ts
  ngOnDestroy() {
	// #21 destroy each dynamic component manually
    this.componentRefs.forEach((ref) => ref.destroy());
    if (this.container) {
      this.container.clear();
    }
  }

  ngAfterViewInit() {
    if (!this.container || !this.components || this.components.length === 0) {
      return;
    }
	// #21 destroy each dynamic component manually
    this.componentRefs.forEach((ref) => ref.destroy()); // clear all refs
    ...
  }
```

##### Custom properties

Creating a pipeline for dynamic rendering lets the author iterate on a page quickly by shuffling around components, which is useful. What would make it a lot more useful would be if you could customize those components. Changing the text rendered, adjusting whether a component has padding on top, should the component show a button, light or dark theme components. Custom properties could change any aspect of the component you would like and give the author high flexibility to change aspects of the page quickly. Custom properties need to be setup before hand when the dynamic components are being created by the developers.

When a component or module is loaded, it should contain an extra function for parsing the customization data that you receive from page data requests. This is just a regular function that returns an object. In this application they are called `componentDataResolver`'s. Creating and attaching these functions to the components is covered in the last section about creating a component for dynamic rendering.

To add this to the pipeline, start at loading the component info from component manifest map. Instead of just returning the processed component or module we should now also return the component JSON information #22. This would be the whole object that contained the name of the component #23.

```typescript
// render-template.component.ts -> ngAfterViewInit
const itemRef = await this.dynamicComponentsService.loadComponentInfo(
  componentTemplate.name
);
// #22 componentTemplate being return on the object is the JSON data
return { renderItemRef: itemRef, componentTemplate };
```

These customized properties live in the `componentData` property on the example JSON response from before #24.

```JSON
// #23 componentTemplate object
{
  "name": "postPreview",
  "componentData": {
	// #24 these are the customized properties added to the components
	"title": "When a tree falls in the forest what happens?",
	"subtitle": "The forest critters loose a long time friend but gain a new one",
	"shortName": "trees",
	"author": "Lars Hoff",
	"dateAsString": "May 31, 2023"
  }
}
```

Then in the `renderComponents` method we should pass the component data along to the create component function #25.

```typescript
// render-template.component.ts -> renderComponents
const newComponent = this.dynamicComponentsService.createComponent(
  this.container,
  // #25 passing along data here
  item.value.componentTemplate,
  item.value.renderItemRef
);
```

The `createComponent` method on the dynamic-components service would need to be updated to pass that data through to the attached resolver function #26. Then, take that parsed data and apply it to the component instance after it has been created #27.

```typescript
// dynamic-component.service.ts
  createComponent(
    container: ViewContainerRef,
    componentTemplate: ComponentTemplate,
    renderItem: LoadedRenderItem
  ) {
    let componentRef: ComponentRef<any>;
    let resolverData: any;

    if (renderItem instanceof NgModuleRef) {
	  // #26 check is resolver is present then pass componentData
      resolverData =
        renderItem.instance.componentDataResolver &&
        renderItem.instance.componentDataResolver(
          componentTemplate.componentData || {}
        );
      componentRef = container.createComponent(renderItem.instance.entry, {
        ngModuleRef: renderItem,
      });
    } else {
      componentRef = container.createComponent(renderItem);
	  // #26 check is resolver is present then pass componentData
      resolverData = componentRef.instance.componentDataResolver(
        componentTemplate.componentData || {}
      );
    }

    if (resolverData) {
	  // #27 apply the resolver data as properties on the component
      Object.keys(resolverData).forEach(
        (key) => (componentRef.instance[key] = resolverData[key])
      );
    }

    container.insert(componentRef.hostView);
    return componentRef;
  }
```

The `componentDataResolver` can live on either the module instance or component instance, except in the case of a standalone component which must be the component instance. In this application all module based components have the resolver live on the module instance. After those additions, the custom properties present in the `componentData` property on the JSON response will be present on your dynamic components.

##### Creating dynamic components

Making a dynamic component is very easy. Create the component the same way you would any other Angular component. The only additional work is to create a `componentDataResolver` function and to add the component to the manifest to that it can be used in the pipeline.

```typescript
// page-section.component.ts
@Component({
  selector: 'app-page-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'd-block col-lg-8 col-md-10 mx-auto',
  },
  template: `
    <h2 *ngIf="sectionHeading" class="section-heading">{{ sectionHeading }}</h2>
    <!-- #29 dynamic component with a render template facilitates nested rendering -->
    <app-render-template [components]="children" />
  `,
})
export class PageSectionComponent implements OnInit {
  sectionHeading: string;
  children: ComponentTemplate[];

  constructor() {}

  ngOnInit() {}
}
// #28 resolver function for module component, defined as an exported function
export const componentDataResolver = (data: ComponentData) => {
  return {
    sectionHeading: data.sectionHeading,
    children: data.children,
  };
};
```

Here is an example of a module based dynamic component. It looks like any other Angular component, but what makes it different is its presence in the manifest and the resolver function. The resolver is going to take the component data from the JSON response, pull out what it needs and pass it along #28. The resolver function could be used for data massaging, more processing or what ever you need. The object thats returned is what is effectively spread over the component' properties for use. In this case the `sectionHeading` is getting its text from the resolver, not an input or a service. Also you'll notice this component has nested rendering #29. The children are passed to another instance of the `app-render-template`. The section component enables the author to have sections of the page all be dynamic instead of just the entire page only being able to render one component.

```typescript
// page-section.module.ts
@NgModule({
  imports: [DynamicTemplatesModule, CommonModule],
  exports: [PageSectionComponent],
  declarations: [PageSectionComponent],
  providers: [],
})
export class PageSectionModule implements DynamicModule {
  // #30 module instance properties accessed in rendering pipeline
  entry = PageSectionComponent;
  componentDataResolver = componentDataResolver;
}
```

Then in the module for the component there is the normal imports and declarations, but we also attach the component to the `entry` property of the module and the resolver to `componentDataResolver` #30. Then during the rendering processing we access these properties on the module instance.

A standalone component is simpler than that cause we can do away with the whole module and entry property. We only need a resolver function as a method on the component itself which can then be access through its instance #31. The resolver could instead be on the component in the case of it being module based component as well.

```typescript
// text-container.component.ts
@Component({
  selector: 'app-text-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  standalone: true,
  template: ` <p *ngFor="let item of text">{{ item }}</p> `,
})
export class TextContainerComponent implements DynamicComponent {
  text: string[];
  constructor() {}
  // #31 resolver on function instead of defined as outside
  componentDataResolver(data: ComponentData) {
    return {
      text: data.text,
    };
  }
}
```

#### Next steps

The above sets up a good render pipeline. Where can we go from here? There's always room for improvement. Here are a couple idea's you could take advantage of.

##### Compiled components cache

Currently, in the pipeline every component is compiled and processed, regardless if it's been used many times before. A compiled component cache would remember components that have already been processed and pull on those to create subsequent components of the same type. Setting this up can reduce overhead in processing and improve the efficiency of the dynamic rendering process at the cost of memory used by the cache.

##### Dynamic page routes

Right now for a page to take advantage of the dynamic rendering, there needs to be a page setup in the `app.routes`. That page also needs to have an `app-render-template` component within the page component' template that receives the list of components to render. So pages that want to take advantage of dynamic rendering have to be set up before hand. If an application wants to be even more dynamic, a flow could be set up that allows for dynamic page routes. When the application is bootstrapped, static routes could be merged with a response that contains routes setup by a content author. These routes would then need to point to a basic template that contains an `app-render-template`. From there the flow would be the same as before, but now the application would have dynamic routes with dynamic content.

#### Conclusion

Using dynamic rendering empowers business and content authors, especially when paired with a CMS. It promotes consistency and reusability by defining a set of building blocks that can be used and reused to build your web pages. It also enables quick iteration on design and customization without the need for dev work and a build and deploy step, which will deliver the product to your users that much faster.
