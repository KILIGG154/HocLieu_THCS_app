import { PracticeQuadratic } from '../scenes/PracticeQuadratic';
export class AppRouter {
    constructor(game) {
        this.game = game;
        // Định nghĩa các route chính của app với URL
        this.routes = {
            introduction: { key: 'Introduction', url: '/introduction' },
            grade9: { key: 'Grade9', url: '/introduction/grade9' },
            grade6: { key: 'Grade6', url: '/introduction/grade6' },
            grade7: { key: 'Grade7', url: '/introduction/grade7' },
            grade8: { key: 'Grade8', url: '/introduction/grade8' },
            practiceQuadratic: { key: 'PracticeQuadratic', url: '/introduction/grade9/practice-quadratic' },
            
            home: { key: 'Home', url: '/' }
        };
    }

    goTo(routeKey, data) {
        const route = this.routes[routeKey] || { key: routeKey, url: `/${routeKey.toLowerCase()}` };
        this.game.scene.start(route.key, data);
        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', route.url);
        }
    }

    getRoutes() {
        return Object.keys(this.routes).reduce((acc, key) => {
            acc[key] = this.routes[key].url;
            return acc;
        }, {});
    }
}