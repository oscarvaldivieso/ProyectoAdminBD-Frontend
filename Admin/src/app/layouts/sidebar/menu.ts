import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARD.TEXT',
        icon: 'ph-gauge',
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.DASHBOARD.LIST.ANALYTICS',
                link: '/analytics',
                parentId: 2
            },
            {
                id: 4,
                label: 'MENUITEMS.DASHBOARD.LIST.CRM',
                link: '/crm',
                parentId: 2
            },
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARD.LIST.ECOMMERCE',
                link: '/',
                parentId: 2
            },
            {
                id: 6,
                label: 'MENUITEMS.DASHBOARD.LIST.LEARNING',
                link: '/learning',
                parentId: 2
            },
            {
                id: 7,
                label: 'MENUITEMS.DASHBOARD.LIST.REALESTATE',
                link: '/real-estate',
                parentId: 2
            }
        ]
    },
    {
        id: 8,
        label: 'MENUITEMS.APPS.TEXT',
        isTitle: true
    },
    {
        id: 12,
        label: 'MENUITEMS.APPS.LIST.BASES',
        icon: 'ph-storefront',
        link: '/databases/list'
        
    },
    {
        id: 24,
        label: 'MENUITEMS.APPS.LIST.VUELO',
        icon: 'ri ri-plane-fill ',
        parentId: 8,
        subItems: [
            {
                id: 25,
                label: 'MENUITEMS.APPS.LIST.VUELOS',
                link: '/vuelo/vuelos/list',
                parentId: 24,
                isCollapsed: true
            }
        ]
    },
    {
        id: 39,
        label: 'MENUITEMS.APPS.LIST.GENERAL',
        icon: 'ph-file-text',
        parentId: 8,
        subItems: [
            {
                id: 40,
                label: 'MENUITEMS.APPS.LIST.EMPLEADOS',
                link: '/general/empleados/list',
                parentId: 39
            },
            {
                id: 41,
                label: 'MENUITEMS.APPS.LIST.CLIENTES',
                link: '/general/clientes/list',
                parentId: 39
            },
            {
                id: 42,
                label: 'MENUITEMS.APPS.LIST.TOURS',
                link: '/general/tours/list',
                parentId: 39
            }
        ]
    },
    
    {
        id: 43,
        label: 'MENUITEMS.APPS.LIST.HOTEL',
        icon: 'ri  ri-hotel-bed-fill',
        parentId: 8,
        subItems: [
            {
                id: 44,
                label: 'MENUITEMS.APPS.LIST.HOTELES',
                link: '/hotel/hoteles/list',
                parentId: 43
            },
            {
                id: 45,
                label: 'MENUITEMS.APPS.LIST.HABITACIONES',
                link: '/hotel/habitaciones/list',
                parentId: 43
            }
        ]
    },
    {
        id: 46,
        label: 'MENUITEMS.APPS.LIST.ACCESO',
        icon: 'ri  ri-lock-2-fill ',
        parentId: 8,
        subItems: [
            {
                id: 47,
                label: 'MENUITEMS.APPS.LIST.USUARIO',
                link: '/acceso/usuarios/list',
                parentId: 46
            },
            {
                id: 50,
                label: 'MENUITEMS.APPS.LIST.ROLES',
                link: '/acceso/roles/list',
                parentId: 46
            }
        ]
    },
    {
        id: 48,
        label: 'MENUITEMS.APPS.LIST.PAQUETE',
        icon: 'ri  ri-lock-2-fill ',
        parentId: 8,
        subItems: [
            {
                id: 49,
                label: 'MENUITEMS.APPS.LIST.PAQUETES',
                link: '/paquete/paquetes/list',
                parentId: 48
            }
        ]
    }
    
    
]