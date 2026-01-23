/**
 * VRP Solver
 * Vehicle Routing Problem solver using Google OR-Tools
*/

#include <vector>
#include "ortools/constraint_solver/routing.h"
#include "ortools/constraint_solver/routing_enums.pb.h"
#include "ortools/constraint_solver/routing_index_manager.h"
#include "ortools/constraint_solver/routing_parameters.h"

using namespace std;

namespace vrp_solver {
    using namespace operations_research;

    struct VRPSolution {
        vector<vector<int>> routes; // Routes for each vehicle
        vector<int64_t> routeDistances; // Distance for each route
        int64_t totalDistance;
        bool success; // Solve success
    };

/**
 * Solve a basic VRP Problem
 * @param distanceMatrix Distance matrix between all locations
 * @param numVehicles Number of available vehicles
 * @param depotIndex Index of the depot (starting point)
 * @return VRPSolution struct with routes and distances
*/
VRPSolution SolveVRP(
    const vector<vector<int64_t>>& distanceMatrix,
    int numVehicles,
    int depotIndex
) {
    VRPSolution solution;
    solution.success = false;
    solution.totalDistance = 0;

    int numLocations = distanceMatrix.size();

    // Create Routing Index Manager
    RoutingIndexManager manager(numLocations, numVehicles, 
        RoutingIndexManager::NodeIndex(depotIndex));

    // Create Routing Model
    RoutingModel routing(manager);

    const int transitCallbackIndex = routing.RegisterTransitCallback(
        [&distanceMatrix, &manager](int64_t fromIndex, int64_t toIndex) -> int64_t {
            int fromNode = manager.IndexToNode(fromIndex).value();
            int toNode = manager.IndexToNode(toIndex).value();
            return distanceMatrix[fromNode][toNode];
        }
    );

    // Define cost of each arc
    routing.SetArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

    // Add distance constraint
    routing.AddDimension(
        transitCallbackIndex,
        0, // no slack
        3000000, // max dstance per vehicle (3000 km in meters)
        true, // start cumul to zero
        "Distance"
    );

    // Set search parameters
    RoutingSearchParameters searchParameters = DefaultRoutingSearchParameters();
    searchParameters.set_first_solution_strategy(
        FirstSolutionStrategy::PATH_CHEAPEST_ARC
    );

    // Solve the problem 
    const Assignment* assignment = routing.SolveWithParameters(searchParameters);

    if (assignment != nullptr) {
        solution.success = true;
        solution.routes.resize(numVehicles);
        solution.routeDistances.resize(numVehicles, 0);

        for (int vehicleId = 0; vehicleId < numVehicles; ++vehicleId) {
            int64_t routeDistance = 0;
            int64_t index = routing.Start(vehicleId);

            while(!routing.IsEnd(index)) {
                int nodeIndex = manager.IndexToNode(index).value();
                solution.routes[vehicleId].push_back(nodeIndex);

                int64_t previousIndex = index;
                index = assignment->Value(routing.NextVar(index));
                routeDistance += routing.GetArcCostForVehicle(
                    previousIndex, index, vehicleId
                );

                solution.routeDistances[vehicleId] = routeDistance;
                solution.totalDistance += routeDistance;
            }
        }
    }
    return solution;
}
}