const MapService = {

    createRoutes(routes) {
        let polylines = []

        for (let i = 0; i < routes.length; i++) {
            if (routes[i]) {
                const route = JSON.parse(routes[i])
                if (route.routes && route.routes.length) {
                    polylines.push(route.routes[0].polyline.encodedPolyline)
                }
            }
        }

        return polylines
    }
}

export default MapService