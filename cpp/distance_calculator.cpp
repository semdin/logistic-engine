/**
 * Distance Calculator
 * Calculates distances using Haversine formula (as-the-crow-flies)
 * and preapres distance matrix for VRP solver
 */

 #include <cmath>
 #include <vector>

 using namespace std;

 namespace distance_calculator {

    // Earth radius in kilometers
    constexpr double EARTH_RADIUS_KM = 6371.0;

    // Convert degrees to radians
    inline double toRadians(double degrees) {
        return degrees * M_PI / 180.0;
    }

    /** 
     * Calculate distance between two GPS coordinates using Haversine formula
     * @param lat1 Latitude of point 1 (degrees)
     * @param lon1 Longtitude of point 1 (degrees)
     * @param lat2
     * @param lon2
     * @return Distance in kilometers
    */
    double haversineDistance(double lat1, double lon1, double lat2, double lon2){
        double dLat = toRadians(lat2 - lat1);
        double dLon = toRadians(lon2 - lon1);

        double a = sin(dLat / 2) * sin(dLat / 2) +
                    cos(toRadians(lat1)) * cos(toRadians(lat2)) * 
                    sin(dLon / 2) * sin(dLon / 2);
        double c = 2 * atan2(sqrt(a), sqrt(1-a));

        return EARTH_RADIUS_KM * c;
    }

    /*
     * Create a distance matrix from a list of coordinates
     * @param latitudes Vector of lats
     * @param longtitudes Vector of longs
     * @return 2D distance matrix (in meters for OR-Tools compatibility)
     */
     vector<vector<int64_t>> createDistanceMatrix(
        const vector<double>& latitudes,
        const vector<double>& longtitudes
     ){
        size_t n = latitudes.size();
        vector<vector<int64_t>> matrix(n, vector<int64_t>(n,0));

        for (size_t i = 0; i < n; ++i) {
            for (size_t j = 0; j < n; ++j) {
                if( i != j){
                    double distKm = haversineDistance(
                        latitudes[i], longtitudes[i],
                        latitudes[j], longtitudes[j]
                    );

                    // Convert to meters (OR-Tools uses ints)
                    matrix[i][j] = static_cast<int64_t>(distKm * 1000);
                }
            }
        }

        return matrix;
     }
    
 }