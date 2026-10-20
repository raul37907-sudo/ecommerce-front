import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  category: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    // ==================== ELECTRÓNICA (10) ====================
    { id: 1, title: 'Audífonos Bluetooth Pro', price: 899.00, rating: 4.5, reviewsCount: 245, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', category: 'electronica', description: 'Audífonos inalámbricos de alta fidelidad con cancelación activa de ruido y batería de larga duración.' },
    { id: 2, title: 'Smartphone Pro Max', price: 12999.00, rating: 5.0, reviewsCount: 93, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80', category: 'electronica', description: 'Teléfono inteligente de última generación con cámara profesional y gran capacidad de almacenamiento.' },
    { id: 3, title: 'Smartwatch Sport GPS', price: 1599.00, rating: 4.0, reviewsCount: 120, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', category: 'electronica', description: 'Reloj deportivo con GPS integrado, monitor de ritmo cardíaco y resistencia al agua.' },
    { id: 4, title: 'Laptop Ultra Slim i7', price: 18999.00, rating: 4.5, reviewsCount: 87, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80', category: 'electronica', description: 'Laptop ultradelgada de alto rendimiento ideal para desarrollo, diseño y multitarea avanzada.' },
    { id: 5, title: 'Cámara Mirrorless 4K', price: 14499.00, rating: 4.8, reviewsCount: 64, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', category: 'electronica', description: 'Cámara fotográfica profesional con grabación en resolución 4K y lentes intercambiables.' },
    { id: 6, title: 'Bocina Bluetooth Portátil', price: 1199.00, rating: 4.3, reviewsCount: 180, imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80', category: 'electronica', description: 'Bocina resistente al agua con sonido envolvente de 360 grados y graves profundos.' },
    { id: 7, title: 'Tablet 10" Full HD', price: 4599.00, rating: 4.2, reviewsCount: 112, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', category: 'electronica', description: 'Tablet multimedia con pantalla brillante Full HD, ideal para entretenimiento y estudio.' },
    { id: 8, title: 'Consola Portátil Gamer', price: 6899.00, rating: 4.7, reviewsCount: 310, imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80', category: 'electronica', description: 'Consola de videojuegos portátil con controles ergonómicos y gran catálogo de juegos retro y modernos.' },
    { id: 9, title: 'Teclado Mecánico RGB', price: 1299.00, rating: 4.6, reviewsCount: 155, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80', category: 'electronica', description: 'Teclado mecánico para gaming con retroiluminación RGB personalizable y switches táctiles.' },
    { id: 10, title: 'Monitor Gaming 144Hz 27"', price: 5299.00, rating: 4.9, reviewsCount: 201, imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80', category: 'electronica', description: 'Monitor curvo de alta tasa de refresco de 144Hz para una experiencia de juego ultra fluida.' },

    // ==================== MODA (10) ====================
    { id: 11, title: 'Chamarra de Mezclilla Classic', price: 899.00, rating: 4.6, reviewsCount: 142, imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80', category: 'moda', description: 'Chamarra de mezclilla clásica con diseño atemporal, cómoda y duradera.' },
    { id: 12, title: 'Tenis Urbano Casual', price: 1299.00, rating: 4.7, reviewsCount: 215, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80', category: 'moda', description: 'Calzado moderno y cómodo para uso diario con suela acolchada.' },
    { id: 13, title: 'Lentes de Sol Estilo Aviador', price: 499.00, rating: 4.3, reviewsCount: 88, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80', category: 'moda', description: 'Lentes con protección UV y armazón metálico ligero de alta resistencia.' },
    { id: 14, title: 'Mochila de Piel Vintage', price: 1599.00, rating: 4.8, reviewsCount: 110, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', category: 'moda', description: 'Mochila ejecutiva de piel genuina con compartimento especial para laptop.' },
    { id: 15, title: 'Reloj Análogo de Acero', price: 2199.00, rating: 4.5, reviewsCount: 76, imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80', category: 'moda', description: 'Reloj elegante con extensible de acero inoxidable y resistencia a salpicaduras.' },
    { id: 16, title: 'Playera Algodón Minimalista', price: 299.00, rating: 4.2, reviewsCount: 305, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80', category: 'moda', description: 'Playera básica 100% algodón suave con corte moderno.' },
    { id: 17, title: 'Sudadera Oversize con Capucha', price: 699.00, rating: 4.6, reviewsCount: 198, imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80', category: 'moda', description: 'Sudadera holgada de felpa afelpada por dentro para máximo confort.' },
    { id: 18, title: 'Vestido Casual de Verano', price: 799.00, rating: 4.4, reviewsCount: 94, imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80', category: 'moda', description: 'Vestido fresco y ligero, perfecto para climas cálidos y salidas casuales.' },
    { id: 19, title: 'Gorra Ajustable Streetwear', price: 349.00, rating: 4.1, reviewsCount: 167, imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80', category: 'moda', description: 'Gorra estilo urbano con broche ajustable y diseño moderno.' },
    { id: 20, title: 'Cinturón de Piel Legítima', price: 450.00, rating: 4.5, reviewsCount: 82, imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&q=80', category: 'moda', description: 'Cinturón clásico de piel resistente con hebilla metálica elegante.' },

    // ==================== HOGAR (10) ====================
    { id: 21, title: 'Cafetera Programable de Goteo', price: 1199.00, rating: 4.6, reviewsCount: 230, imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80', category: 'hogar', description: 'Cafetera programable ideal para preparar tu café matutino con la temperatura perfecta.' },
    { id: 22, title: 'Freidora de Aire Digital 4.5L', price: 2299.00, rating: 4.9, reviewsCount: 410, imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80', category: 'hogar', description: 'Cocina de manera saludable utilizando poco o nada de aceite con tecnología de circulación de aire caliente.' },
    { id: 23, title: 'Aspiradora Robot Inteligente', price: 4899.00, rating: 4.7, reviewsCount: 175, imageUrl: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=500&q=80', category: 'hogar', description: 'Aspiradora automatizada con sensores de navegación para mantener tus pisos limpios sin esfuerzo.' },
    { id: 24, title: 'Lámpara de Buró LED Touch', price: 399.00, rating: 4.3, reviewsCount: 95, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80', category: 'hogar', description: 'Lámpara de noche con control táctil de intensidad y luz regulable para descanso.' },
    { id: 25, title: 'Juego de Sartenes Antiadherentes', price: 1399.00, rating: 4.5, reviewsCount: 140, imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500&q=80', category: 'hogar', description: 'Set de utensilios de cocina con revestimiento antiadherente de alta durabilidad.' },
    { id: 26, title: 'Humidificador Ultrasónico Aromas', price: 549.00, rating: 4.4, reviewsCount: 188, imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500&q=80', category: 'hogar', description: 'Mejora la calidad del aire de tus espacios con función de difusor de esencias.' },
    { id: 27, title: 'Licuadora de Alta Potencia', price: 1799.00, rating: 4.6, reviewsCount: 205, imageUrl: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&q=80', category: 'hogar', description: 'Licuadora con cuchillas de acero inoxidable para triturar hielo y alimentos duros con facilidad.' },
    { id: 28, title: 'Set de Cuchillos de Cocina', price: 899.00, rating: 4.8, reviewsCount: 115, imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&q=80', category: 'hogar', description: 'Cuchillos profesionales con soporte ergonómico y gran filo.' },
    { id: 29, title: 'Silla Ergonómica para Oficina', price: 3299.00, rating: 4.5, reviewsCount: 160, imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=500&q=80', category: 'hogar', description: 'Silla de escritorio ajustable con soporte lumbar para largas jornadas de trabajo.' },
    { id: 30, title: 'Juego de Edredón Matrimonial', price: 1099.00, rating: 4.3, reviewsCount: 78, imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&q=80', category: 'hogar', description: 'Edredón suave y abrigador con diseño elegante para recámara.' },

    // ==================== DEPORTES (10) ====================
    { id: 31, title: 'Tapete de Yoga Antideslizante', price: 449.00, rating: 4.6, reviewsCount: 290, imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80', category: 'deportes', description: 'Tapete acolchado para yoga, pilates y ejercicios de piso con excelente agarre.' },
    { id: 32, title: 'Set de Mancuernas Ajustables', price: 1899.00, rating: 4.8, reviewsCount: 165, imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&q=80', category: 'deportes', description: 'Pesas ajustables para entrenamiento de fuerza en casa.' },
    { id: 33, title: 'Balón de Fútbol Oficial #5', price: 599.00, rating: 4.5, reviewsCount: 220, imageUrl: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=500&q=80', category: 'deportes', description: 'Balón de alta durabilidad con costuras reforzadas para canchas de pasto.' },
    { id: 34, title: 'Cuerda para Saltar de Velocidad', price: 199.00, rating: 4.4, reviewsCount: 340, imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80', category: 'deportes', description: 'Cuerda ajustable con rodamientos de alta velocidad para ejercicio cardiovascular.' },
    { id: 35, title: 'Bicicleta de Montaña R29', price: 7499.00, rating: 4.7, reviewsCount: 85, imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&q=80', category: 'deportes', description: 'Bicicleta todo terreno con cuadro de aluminio y suspensión delantera.' },
    { id: 36, title: 'Guantes de Boxeo 14oz', price: 799.00, rating: 4.6, reviewsCount: 110, imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=500&q=80', category: 'deportes', description: 'Guantes acolchados para entrenamiento de box y artes marciales mixtas.' },
    { id: 37, title: 'Termo Deportivo 1 Litro', price: 349.00, rating: 4.5, reviewsCount: 195, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80', category: 'deportes', description: 'Botella de agua térmica de acero inoxidable para mantener tus bebidas frías por horas.' },
    { id: 38, title: 'Bandas de Resistencia elásticas', price: 299.00, rating: 4.3, reviewsCount: 410, imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&q=80', category: 'deportes', description: 'Set de bandas de látex con diferentes niveles de resistencia para tonificación.' },
    { id: 39, title: 'Mochila de Hidratación Running', price: 899.00, rating: 4.4, reviewsCount: 72, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', category: 'deportes', description: 'Mochila ligera con bolsa de agua integrada para corredores y ciclistas.' },
    { id: 40, title: 'Lentes Deportivos Ciclismo', price: 549.00, rating: 4.2, reviewsCount: 98, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80', category: 'deportes', description: 'Gafas con micas intercambiables para protección solar y contra el viento.' },

    // ==================== BELLEZA (10) ====================
    { id: 41, title: 'Serum Facial Ácido Hialurónico', price: 499.00, rating: 4.8, reviewsCount: 320, imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', category: 'belleza', description: 'Serum hidratante intensivo para reducir líneas de expresión y dar luminosidad.' },
    { id: 42, title: 'Secadora de Cabello Iónica', price: 999.00, rating: 4.6, reviewsCount: 185, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80', category: 'belleza', description: 'Secadora profesional con tecnología iónica para evitar el frizz.' },
    { id: 43, title: 'Kit de Brochas Maquillaje 12 pzs', price: 349.00, rating: 4.5, reviewsCount: 240, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80', category: 'belleza', description: 'Set completo de brochas con cerdas suaves para maquillaje profesional.' },
    { id: 44, title: 'Paleta de Sombras de Ojos', price: 649.00, rating: 4.7, reviewsCount: 150, imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&q=80', category: 'belleza', description: 'Paleta con alta pigmentación y tonos versátiles para día y noche.' },
    { id: 45, title: 'Perfume Floral 100ml', price: 1899.00, rating: 4.9, reviewsCount: 90, imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80', category: 'belleza', description: 'Fragancia elegante con notas florales duraderas.' },
    { id: 46, title: 'Rasuradora Eléctrica Barba', price: 899.00, rating: 4.4, reviewsCount: 130, imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&q=80', category: 'belleza', description: 'Recortadora de precisión con múltiples peines guía.' },
    { id: 47, title: 'Mascarilla Facial Hidratante', price: 199.00, rating: 4.3, reviewsCount: 210, imageUrl: 'https://images.unsplash.com/photo-1567928269937-ae146e58b358?w=500&q=80', category: 'belleza', description: 'Mascarilla revitalizante para devolver la frescura a la piel cansada.' },
    { id: 48, title: 'Plancha para Cabello Titanio', price: 1299.00, rating: 4.6, reviewsCount: 175, imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80', category: 'belleza', description: 'Plancha alisadora con placas de titanio para un calor uniforme.' },
    { id: 49, title: 'Crema Anti-Edad Noche', price: 799.00, rating: 4.5, reviewsCount: 105, imageUrl: 'https://images.unsplash.com/photo-1608248597261-833250021a97?w=500&q=80', category: 'belleza', description: 'Tratamiento nocturno regenerador para firmeza de la piel.' },
    { id: 50, title: 'Espejo LED Maquillaje', price: 450.00, rating: 4.2, reviewsCount: 88, imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80', category: 'belleza', description: 'Espejo de vanidad con iluminación LED ajustable por puerto USB.' },

    // ==================== JUGUETES (10) ====================
    { id: 51, title: 'Set de Construcción Bloques', price: 899.00, rating: 4.9, reviewsCount: 310, imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&q=80', category: 'juguetes', description: 'Bloques armables para estimular la creatividad y motricidad infantil.' },
    { id: 52, title: 'Carro a Control Remoto 4x4', price: 1199.00, rating: 4.6, reviewsCount: 145, imageUrl: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=500&q=80', category: 'juguetes', description: 'Vehículo todoterreno a escala con tracción en las 4 ruedas.' },
    { id: 53, title: 'Juego de Mesa Estrategia', price: 699.00, rating: 4.8, reviewsCount: 200, imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500&q=80', category: 'juguetes', description: 'Divertido juego de mesa familiar para desarrollar habilidades estratégicas.' },
    { id: 54, title: 'Muñeca Coleccionable Articulada', price: 499.00, rating: 4.5, reviewsCount: 120, imageUrl: 'https://images.unsplash.com/photo-1566576721346-d4a376d1710e?w=500&q=80', category: 'juguetes', description: 'Muñeca con accesorios de moda y extremidades articuladas.' },
    { id: 55, title: 'Peluche Gigante de Oso', price: 799.00, rating: 4.7, reviewsCount: 180, imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&q=80', category: 'juguetes', description: 'Oso de peluche sumamente suave, ideal para regalos y decoración.' },
    { id: 56, title: 'Pistola de Agua Alta Presión', price: 299.00, rating: 4.2, reviewsCount: 85, imageUrl: 'https://images.unsplash.com/photo-1531685250084-75a721df4990?w=500&q=80', category: 'juguetes', description: 'Juguete de agua con gran alcance para exteriores y albercas.' },
    { id: 57, title: 'Dron Infantil con Cámara HD', price: 1499.00, rating: 4.4, reviewsCount: 160, imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&q=80', category: 'juguetes', description: 'Dron fácil de pilotar con transmisión de video en tiempo real.' },
    { id: 58, title: 'Rompecabezas 1000 Piezas', price: 349.00, rating: 4.6, reviewsCount: 95, imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&q=80', category: 'juguetes', description: 'Reto visual de 1000 piezas con hermosa ilustración panorámica.' },
    { id: 59, title: 'Pista de Carreras de Velocidad', price: 999.00, rating: 4.5, reviewsCount: 110, imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&q=80', category: 'juguetes', description: 'Pista eléctrica modular con loopings y autos deportivos.' },
    { id: 60, title: 'Kits de Pintura para Niños', price: 249.00, rating: 4.3, reviewsCount: 70, imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80', category: 'juguetes', description: 'Set de acuarelas y lienzos seguros y no tóxicos para pequeños artistas.' },

    // ==================== OFERTAS (10) ====================
    { id: 61, title: 'Combo Teclado + Mouse Inalámbrico', price: 499.00, rating: 4.5, reviewsCount: 310, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80', category: 'ofertas', description: 'Kit periférico inalámbrico con diseño ergonómico y bajo consumo de batería.' },
    { id: 62, title: 'Foco Inteligente WiFi RGB', price: 199.00, rating: 4.4, reviewsCount: 420, imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&q=80', category: 'ofertas', description: 'Bombilla inteligente compatible con asistentes de voz y control por app.' },
    { id: 63, title: 'Power Bank 20000mAh', price: 399.00, rating: 4.7, reviewsCount: 280, imageUrl: 'https://images.unsplash.com/photo-1609592424071-f925f3c91d45?w=500&q=80', category: 'ofertas', description: 'Batería portátil de alta capacidad con puertos de carga rápida.' },
    { id: 64, title: 'Soporte Ajustable para Celular', price: 129.00, rating: 4.2, reviewsCount: 190, imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500&q=80', category: 'ofertas', description: 'Base de escritorio plegable para teléfonos y tabletas.' },
    { id: 65, title: 'Audífonos In-Ear con Micrófono', price: 149.00, rating: 4.1, reviewsCount: 230, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80', category: 'ofertas', description: 'Audífonos alámbricos económicos con sonido claro y manos libres.' },
    { id: 66, title: 'Tira de Luz LED RGB 5m', price: 249.00, rating: 4.5, reviewsCount: 350, imageUrl: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=500&q=80', category: 'ofertas', description: 'Tira de luces LED autoadherible con control remoto para decoración.' },
    { id: 67, title: 'Organizador de Cables Multiuso', price: 99.00, rating: 4.3, reviewsCount: 160, imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', category: 'ofertas', description: 'Clips de silicón autoadhesivos para mantener tu escritorio ordenado.' },
    { id: 68, title: 'Cargador Carga Rápida USB-C 30W', price: 299.00, rating: 4.8, reviewsCount: 270, imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80', category: 'ofertas', description: 'Adaptador de corriente compacto con tecnología de carga rápida.' },
    { id: 69, title: 'Lente Gran Angular para Smartphone', price: 179.00, rating: 4.0, reviewsCount: 85, imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=500&q=80', category: 'ofertas', description: 'Lente de clip para ampliar el campo de visión de la cámara de tu celular.' },
    { id: 70, title: 'Mouse Pad Gamer Extragrande', price: 199.00, rating: 4.6, reviewsCount: 210, imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80', category: 'ofertas', description: 'Alfombrilla de superficie deslizante con base antideslizante para teclado y ratón.' }
  ];

  // Métodos del diccionario/servicio para consumir y manipular datos fácilmente
  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(newProduct: Product): void {
    this.products.push(newProduct);
  }

  updateProduct(updatedProduct: Product): void {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}
