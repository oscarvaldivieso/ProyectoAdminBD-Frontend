import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    
    {
        id: 12,
        label: 'MENUITEMS.APPS.LIST.BASES',
        icon: ' ph-database',
        link: '/databases/list'
    },
    {
        id: 12,
        label: 'MENUITEMS.APPS.LIST.TABLES',
        icon: ' ph-table',
        link: '/tables/list'
        
    },
    {
        id: 13,
        label: 'MENUITEMS.APPS.LIST.QUERIES',
        icon: ' ph-terminal',
        link: '/queries/execute'
    }
    
]