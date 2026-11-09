"use strict";

/*
|--------------------------------------------------------------------------
| PilgrimRoute AI
|--------------------------------------------------------------------------
|
| This application is completely client-side.
|
| No Flask
| No Python
| No database
| No backend
| No API key
|
| It can be hosted directly on GitHub Pages.
|
*/


// ==========================================================================
// PILGRIMAGE DATA
// ==========================================================================

const CIRCUITS = {

    jyotirlingas: {

        id: "jyotirlingas",

        name: "12 Jyotirlingas of Lord Shiva",

        description:
            "Complete circuit covering the twelve revered Jyotirlingas across India.",

        locations: [

            {
                id: "somnath",
                name: "Somnath Jyotirlinga",
                city: "Prabhas Patan",
                state: "Gujarat",
                latitude: 20.8880,
                longitude: 70.4012,
                cluster: "Western Cluster"
            },

            {
                id: "nageshwar",
                name: "Nageshwar Jyotirlinga",
                city: "Dwarka",
                state: "Gujarat",
                latitude: 22.3354,
                longitude: 68.9685,
                cluster: "Western Cluster"
            },

            {
                id: "trimbakeshwar",
                name: "Trimbakeshwar Jyotirlinga",
                city: "Trimbak",
                state: "Maharashtra",
                latitude: 19.9322,
                longitude: 73.5307,
                cluster: "Maharashtra Cluster"
            },

            {
                id: "bhimashankar",
                name: "Bhimashankar Jyotirlinga",
                city: "Pune District",
                state: "Maharashtra",
                latitude: 19.0728,
                longitude: 73.5351,
                cluster: "Maharashtra Cluster"
            },

            {
                id: "grishneshwar",
                name: "Grishneshwar Jyotirlinga",
                city: "Ellora",
                state: "Maharashtra",
                latitude: 20.0240,
                longitude: 75.1779,
                cluster: "Maharashtra Cluster"
            },

            {
                id: "omkareshwar",
                name: "Omkareshwar Jyotirlinga",
                city: "Khandwa",
                state: "Madhya Pradesh",
                latitude: 22.2426,
                longitude: 76.1500,
                cluster: "Central Cluster"
            },

            {
                id: "mahakaleshwar",
                name: "Mahakaleshwar Jyotirlinga",
                city: "Ujjain",
                state: "Madhya Pradesh",
                latitude: 23.1828,
                longitude: 75.7682,
                cluster: "Central Cluster"
            },

            {
                id: "kedarnath",
                name: "Kedarnath Jyotirlinga",
                city: "Kedarnath",
                state: "Uttarakhand",
                latitude: 30.7346,
                longitude: 79.0669,
                cluster: "Northern Cluster"
            },

            {
                id: "kashi_vishwanath",
                name: "Kashi Vishwanath Jyotirlinga",
                city: "Varanasi",
                state: "Uttar Pradesh",
                latitude: 25.3109,
                longitude: 83.0107,
                cluster: "Northern Cluster"
            },

            {
                id: "baidyanath",
                name: "Baidyanath Jyotirlinga",
                city: "Deoghar",
                state: "Jharkhand",
                latitude: 24.4890,
                longitude: 86.6947,
                cluster: "Eastern Cluster"
            },

            {
                id: "mallikarjuna",
                name: "Mallikarjuna Jyotirlinga",
                city: "Srisailam",
                state: "Andhra Pradesh",
                latitude: 16.0730,
                longitude: 78.8680,
                cluster: "Southern Cluster"
            },

            {
                id: "ramanathaswamy",
                name: "Ramanathaswamy Jyotirlinga",
                city: "Rameswaram",
                state: "Tamil Nadu",
                latitude: 9.2881,
                longitude: 79.3129,
                cluster: "Southern Cluster"
            }
        ]
    }
};


// ==========================================================================
// SUPPORTED STARTING CITIES
// ==========================================================================

const STARTING_LOCATIONS = {

    mumbai: {
        name: "Mumbai",
        latitude: 19.0760,
        longitude: 72.8777
    },

    delhi: {
        name: "Delhi",
        latitude: 28.6139,
        longitude: 77.2090
    },

    "new delhi": {
        name: "Delhi",
        latitude: 28.6139,
        longitude: 77.2090
    },

    bengaluru: {
        name: "Bengaluru",
        latitude: 12.9716,
        longitude: 77.5946
    },

    bangalore: {
        name: "Bengaluru",
        latitude: 12.9716,
        longitude: 77.5946
    },

    hyderabad: {
        name: "Hyderabad",
        latitude: 17.3850,
        longitude: 78.4867
    },

    pune: {
        name: "Pune",
        latitude: 18.5204,
        longitude: 73.8567
    },

    chennai: {
        name: "Chennai",
        latitude: 13.0827,
        longitude: 80.2707
    },

    kolkata: {
        name: "Kolkata",
        latitude: 22.5726,
        longitude: 88.3639
    },

    ahmedabad: {
        name: "Ahmedabad",
        latitude: 23.0225,
        longitude: 72.5714
    },

    jaipur: {
        name: "Jaipur",
        latitude: 26.9124,
        longitude: 75.7873
    }
};


// ==========================================================================
// DOM
// ==========================================================================

const circuitElement =
    document.getElementById("circuit");

const startingLocationElement =
    document.getElementById("startingLocation");

const planButton =
    document.getElementById("planButton");

const buttonText =
    document.getElementById("buttonText");

const buttonSpinner =
    document.getElementById("buttonSpinner");

const errorBox =
    document.getElementById("errorBox");

const resultsElement =
    document.getElementById("results");

const summaryElement =
    document.getElementById("summary");

const itineraryElement =
    document.getElementById("itinerary");


// ==========================================================================
// LEAFLET STATE
// ==========================================================================

let map = null;

let markerLayer = null;

let routeLayer = null;


// ==========================================================================
// DISTANCE
// ==========================================================================

function haversineDistance(pointA, pointB) {

    const earthRadiusKm = 6371;

    const lat1 =
        degreesToRadians(pointA.latitude);

    const lat2 =
        degreesToRadians(pointB.latitude);

    const deltaLat =
        degreesToRadians(
            pointB.latitude - pointA.latitude
        );

    const deltaLon =
        degreesToRadians(
            pointB.longitude - pointA.longitude
        );


    const a =
        Math.sin(deltaLat / 2) ** 2
        +
        Math.cos(lat1)
        *
        Math.cos(lat2)
        *
        Math.sin(deltaLon / 2) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return earthRadiusKm * c;
}


function degreesToRadians(degrees) {

    return degrees * Math.PI / 180;
}


// ==========================================================================
// STARTING LOCATION
// ==========================================================================

function resolveStartingLocation(value) {

    const normalized =
        value
            .trim()
            .toLowerCase();


    if (STARTING_LOCATIONS[normalized]) {

        return STARTING_LOCATIONS[normalized];
    }


    /*
     * Also support:
     *
     * Mumbai, Maharashtra
     * Delhi, India
     * Bengaluru, Karnataka
     */

    const city =
        normalized
            .split(",")[0]
            .trim();


    if (STARTING_LOCATIONS[city]) {

        return STARTING_LOCATIONS[city];
    }


    return null;
}


// ==========================================================================
// CLUSTER FUNCTIONS
// ==========================================================================

function groupByCluster(locations) {

    const clusters = {};


    locations.forEach(location => {

        if (!clusters[location.cluster]) {

            clusters[location.cluster] = [];
        }

        clusters[location.cluster].push(location);
    });


    return clusters;
}


function clusterCentroid(locations) {

    let latitude = 0;

    let longitude = 0;


    locations.forEach(location => {

        latitude += location.latitude;

        longitude += location.longitude;
    });


    return {
        latitude: latitude / locations.length,
        longitude: longitude / locations.length
    };
}


function distanceToCluster(point, cluster) {

    const center =
        clusterCentroid(cluster);


    return haversineDistance(
        point,
        center
    );
}


// ==========================================================================
// NEAREST NEIGHBOR
// ==========================================================================

function nearestLocation(
    current,
    candidates
) {

    let best = null;

    let bestDistance = Infinity;


    candidates.forEach(candidate => {

        const distance =
            haversineDistance(
                current,
                candidate
            );


        if (distance < bestDistance) {

            bestDistance = distance;

            best = candidate;
        }
    });


    return best;
}


// ==========================================================================
// CLUSTER-AWARE ROUTE
// ==========================================================================

function buildClusterRoute(
    start,
    locations
) {

    const clusters =
        groupByCluster(locations);


    let remainingClusters =
        Object.entries(clusters);


    const route = [];

    let current = start;


    /*
     * Select the closest cluster.
     */
    while (remainingClusters.length > 0) {

        remainingClusters.sort(
            (a, b) => {

                const distanceA =
                    distanceToCluster(
                        current,
                        a[1]
                    );

                const distanceB =
                    distanceToCluster(
                        current,
                        b[1]
                    );

                return distanceA - distanceB;
            }
        );


        const [
            clusterName,
            clusterLocations
        ] = remainingClusters.shift();


        /*
         * Once inside a cluster,
         * use nearest-neighbor ordering.
         */
        let remainingLocations =
            [...clusterLocations];


        while (
            remainingLocations.length > 0
        ) {

            const next =
                nearestLocation(
                    current,
                    remainingLocations
                );


            route.push(next);

            current = next;


            remainingLocations =
                remainingLocations.filter(
                    location =>
                        location.id !== next.id
                );
        }
    }


    /*
     * Improve route using 2-opt.
     */
    return improveRouteWithTwoOpt(
        start,
        route
    );
}


// ==========================================================================
// 2-OPT
// ==========================================================================

function calculateRouteDistance(
    start,
    route
) {

    let total = 0;

    let current = start;


    route.forEach(location => {

        total +=
            haversineDistance(
                current,
                location
            );

        current = location;
    });


    return total;
}


function improveRouteWithTwoOpt(
    start,
    route
) {

    let best =
        [...route];

    let improved = true;


    while (improved) {

        improved = false;


        let bestDistance =
            calculateRouteDistance(
                start,
                best
            );


        for (
            let i = 0;
            i < best.length - 1;
            i++
        ) {

            for (
                let j = i + 1;
                j < best.length;
                j++
            ) {

                const candidate = [

                    ...best.slice(
                        0,
                        i
                    ),

                    ...best
                        .slice(
                            i,
                            j + 1
                        )
                        .reverse(),

                    ...best.slice(
                        j + 1
                    )
                ];


                const candidateDistance =
                    calculateRouteDistance(
                        start,
                        candidate
                    );


                if (
                    candidateDistance
                    <
                    bestDistance - 0.1
                ) {

                    best =
                        candidate;

                    bestDistance =
                        candidateDistance;

                    improved =
                        true;
                }
            }
        }
    }


    return best;
}


// ==========================================================================
// ITINERARY
// ==========================================================================

function createItinerary(
    start,
    route
) {

    let current =
        start;

    let cumulativeDistance =
        0;


    return route.map(
        (destination, index) => {

            const legDistance =
                haversineDistance(
                    current,
                    destination
                );


            cumulativeDistance +=
                legDistance;


            const item = {

                step:
                    index + 1,

                ...destination,

                legDistanceKm:
                    legDistance,

                cumulativeDistanceKm:
                    cumulativeDistance,

                bookingUrl:
                    buildTransitUrl(
                        destination
                    )
            };


            current =
                destination;


            return item;
        }
    );
}


// ==========================================================================
// TRANSIT URL
// ==========================================================================

function buildTransitUrl(
    destination
) {

    const query =
        encodeURIComponent(
            `${destination.city}, ${destination.state}`
        );


    /*
     * Generic Google travel search.
     *
     * No API key required.
     */
    return `https://www.google.com/travel/search?q=${query}`;
}


// ==========================================================================
// MAP INITIALIZATION
// ==========================================================================

function initializeMap() {

    if (map !== null) {

        return;
    }


    map =
        L.map("map");


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(map);


    markerLayer =
        L.layerGroup()
            .addTo(map);


    routeLayer =
        L.layerGroup()
            .addTo(map);


    map.setView(
        [20.5937, 78.9629],
        5
    );
}


// ==========================================================================
// CUSTOM MARKERS
// ==========================================================================

function destinationIcon(
    step
) {

    return L.divIcon({

        className: "",

        html: `
            <div class="route-marker">
                ${step}
            </div>
        `,

        iconSize:
            [32, 32],

        iconAnchor:
            [16, 16],

        popupAnchor:
            [0, -16]
    });
}


function startIcon() {

    return L.divIcon({

        className: "",

        html: `
            <div class="start-marker pulse">
                S
            </div>
        `,

        iconSize:
            [38, 38],

        iconAnchor:
            [19, 19],

        popupAnchor:
            [0, -19]
    });
}


// ==========================================================================
// ESCAPE HTML
// ==========================================================================

function escapeHtml(
    value
) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==========================================================================
// DRAW MAP
// ==========================================================================

function drawMap(
    start,
    itinerary
) {

    initializeMap();


    markerLayer.clearLayers();

    routeLayer.clearLayers();


    const points = [

        start,

        ...itinerary
    ];


    const coordinates =
        points.map(point => [
            point.latitude,
            point.longitude
        ]);


    /*
     * Geographic route line.
     *
     * This is intentionally not presented as a
     * turn-by-turn road route.
     */
    const line =
        L.polyline(
            coordinates,
            {
                color: "#7c3aed",
                weight: 5,
                opacity: 0.8
            }
        );


    line.addTo(
        routeLayer
    );


    // Starting point
    const startMarker =
        L.marker(
            [
                start.latitude,
                start.longitude
            ],
            {
                icon:
                    startIcon()
            }
        );


    startMarker.bindPopup(`
        <div>
            <div
                style="
                    color:#059669;
                    font-size:11px;
                    font-weight:800;
                    text-transform:uppercase;
                "
            >
                Starting Point
            </div>

            <div
                style="
                    margin-top:4px;
                    font-weight:900;
                    font-size:15px;
                "
            >
                ${escapeHtml(start.name)}
            </div>
        </div>
    `);


    startMarker.addTo(
        markerLayer
    );


    // Destination markers
    itinerary.forEach(item => {

        const marker =
            L.marker(
                [
                    item.latitude,
                    item.longitude
                ],
                {
                    icon:
                        destinationIcon(
                            item.step
                        )
                }
            );


        marker.bindPopup(`
            <div>

                <div
                    style="
                        color:#6d28d9;
                        font-size:11px;
                        font-weight:800;
                        text-transform:uppercase;
                    "
                >
                    Step ${item.step}
                </div>

                <div
                    style="
                        margin-top:4px;
                        font-weight:900;
                        font-size:15px;
                    "
                >
                    ${escapeHtml(item.name)}
                </div>

                <div
                    style="
                        margin-top:4px;
                        color:#64748b;
                        font-size:12px;
                    "
                >
                    ${escapeHtml(item.city)},
                    ${escapeHtml(item.state)}
                </div>

            </div>
        `);


        marker.addTo(
            markerLayer
        );
    });


    map.fitBounds(
        line.getBounds(),
        {
            padding:
                [50, 50]
        }
    );


    setTimeout(
        () => map.invalidateSize(),
        200
    );
}


// ==========================================================================
// FORMAT DISTANCE
// ==========================================================================

function formatDistance(
    distanceKm
) {

    if (distanceKm >= 1000) {

        return `${(
            distanceKm / 1000
        ).toFixed(1)}k km`;
    }


    return `${Math.round(
        distanceKm
    )} km`;
}


// ==========================================================================
// RENDER ITINERARY
// ==========================================================================

function renderItinerary(
    itinerary
) {

    itineraryElement.innerHTML =
        "";


    itinerary.forEach(
        (item, index) => {

            const isLast =
                index ===
                itinerary.length - 1;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "relative";


            card.innerHTML = `

                <div class="flex gap-4">

                    <!-- Number -->

                    <div class="relative flex w-9 shrink-0 justify-center">

                        <div
                            class="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-violet-700 text-xs font-black text-white shadow-md shadow-violet-100"
                        >
                            ${item.step}
                        </div>

                        ${
                            !isLast
                                ? `
                                    <div
                                        class="absolute left-1/2 top-9 h-full w-px -translate-x-1/2 bg-violet-100"
                                    ></div>
                                `
                                : ""
                        }

                    </div>


                    <!-- Content -->

                    <div class="min-w-0 flex-1 pb-7">

                        <div
                            class="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 transition hover:border-violet-200 hover:bg-violet-50/30"
                        >

                            <div class="flex items-start justify-between gap-3">

                                <div>

                                    <p
                                        class="text-[10px] font-black uppercase tracking-widest text-violet-600"
                                    >
                                        ${escapeHtml(
                                            item.cluster
                                        )}
                                    </p>

                                    <h4
                                        class="mt-1 text-sm font-black text-slate-900"
                                    >
                                        ${escapeHtml(
                                            item.name
                                        )}
                                    </h4>

                                    <p
                                        class="mt-1 text-xs text-slate-500"
                                    >
                                        ${escapeHtml(
                                            item.city
                                        )},
                                        ${escapeHtml(
                                            item.state
                                        )}
                                    </p>

                                </div>


                                <span
                                    class="whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-600 shadow-sm"
                                >
                                    ${formatDistance(
                                        item.legDistanceKm
                                    )}
                                </span>

                            </div>


                            <div
                                class="mt-4 flex flex-col gap-3 border-t border-stone-200 pt-3 sm:flex-row sm:items-center sm:justify-between"
                            >

                                <div>

                                    <p
                                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
                                    >
                                        From previous stop
                                    </p>

                                    <p
                                        class="mt-1 text-xs font-bold text-slate-600"
                                    >
                                        ${formatDistance(
                                            item.legDistanceKm
                                        )}
                                    </p>

                                </div>


                                <a
                                    href="${item.bookingUrl}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-black text-white transition hover:bg-violet-700"
                                >
                                    Book Transit ↗
                                </a>

                            </div>

                        </div>

                    </div>

                </div>
            `;


            itineraryElement.appendChild(
                card
            );
        }
    );
}


// ==========================================================================
// GENERATE ROUTE
// ==========================================================================

function generateRoute() {

    clearError();


    const startingLocation =
        startingLocationElement
            .value
            .trim();


    const circuitId =
        circuitElement.value;


    if (!startingLocation) {

        showError(
            "Please enter your starting location."
        );

        startingLocationElement.focus();

        return;
    }


    const start =
        resolveStartingLocation(
            startingLocation
        );


    if (!start) {

        showError(
            "Starting city not found. Try Mumbai, Delhi, Bengaluru, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad or Jaipur."
        );

        return;
    }


    const circuit =
        CIRCUITS[
            circuitId
        ];


    if (!circuit) {

        showError(
            "Selected sacred circuit was not found."
        );

        return;
    }


    setLoading(
        true
    );


    /*
     * Small delay gives the UI time to show
     * the loading state before the algorithm runs.
     */
    setTimeout(
        () => {

            try {

                const route =
                    buildClusterRoute(
                        start,
                        circuit.locations
                    );


                const itinerary =
                    createItinerary(
                        start,
                        route
                    );


                const totalDistance =
                    calculateRouteDistance(
                        start,
                        route
                    );


                renderSummary(
                    start,
                    itinerary,
                    totalDistance
                );


                renderItinerary(
                    itinerary
                );


                drawMap(
                    start,
                    itinerary
                );


                resultsElement
                    .classList
                    .remove("hidden");


                summaryElement
                    .classList
                    .remove("hidden");


                /*
                 * Scroll to result on mobile.
                 */
                if (
                    window.innerWidth < 1024
                ) {

                    setTimeout(
                        () => {

                            resultsElement
                                .scrollIntoView({
                                    behavior:
                                        "smooth",
                                    block:
                                        "start"
                                });

                        },
                        100
                    );
                }

            } catch (error) {

                console.error(
                    error
                );

                showError(
                    "Unable to generate the route. Please try again."
                );

            } finally {

                setLoading(
                    false
                );
            }

        },
        100
    );
}


// ==========================================================================
// SUMMARY
// ==========================================================================

function renderSummary(
    start,
    itinerary,
    totalDistance
) {

    document.getElementById(
        "summaryStart"
    ).textContent =
        start.name;


    document.getElementById(
        "summaryStops"
    ).textContent =
        `${itinerary.length} Jyotirlingas`;


    document.getElementById(
        "summaryDistance"
    ).textContent =
        `${Math.round(
            totalDistance
        ).toLocaleString()} km`;
}


// ==========================================================================
// LOADING
// ==========================================================================

function setLoading(
    loading
) {

    planButton.disabled =
        loading;


    if (loading) {

        buttonText.textContent =
            "Planning Route...";

        buttonSpinner
            .classList
            .remove("hidden");

    } else {

        buttonText.textContent =
            "Generate Route";

        buttonSpinner
            .classList
            .add("hidden");
    }
}


// ==========================================================================
// ERROR
// ==========================================================================

function showError(
    message
) {

    errorBox.textContent =
        message;

    errorBox.classList
        .remove("hidden");
}


function clearError() {

    errorBox.textContent =
        "";

    errorBox.classList
        .add("hidden");
}


// ==========================================================================
// EVENT LISTENERS
// ==========================================================================

planButton.addEventListener(
    "click",
    generateRoute
);


startingLocationElement.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            generateRoute();
        }
    }
);


// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Initialize Leaflet only after
         * DOM is ready.
         */
        initializeMap();
    }
);
