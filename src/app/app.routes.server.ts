import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'descripcion-producto/:id',
    renderMode: RenderMode.Server // <--- Cambiado a Server para que no exija parámetros estáticos
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
