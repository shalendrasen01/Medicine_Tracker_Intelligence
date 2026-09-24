from ortools.linear_solver import pywraplp


def optimize_redistribution(
    sources: list,
    destinations: list,
    distances: list,
):
    solver = pywraplp.Solver.CreateSolver("SCIP")

    if not solver:
        raise RuntimeError("SCIP solver could not be created.")

    # Create distance lookup
    distance_map = {
        (d["source_phc"], d["destination_phc"]): d["distance_km"]
        for d in distances
    }

    # Create decision variables
    shipments = {}

    for source in sources:
        for destination in destinations:
            if source["medicine_id"] != destination["medicine_id"]:
                continue

            key = (source["phc_id"], destination["phc_id"])

            if key not in distance_map:
                continue

            shipments[key] = solver.NumVar(
                0,
                solver.infinity(),
                f"ship_{source['phc_id']}_{destination['phc_id']}",
            )

    # Source surplus constraints
    for source in sources:
        outgoing = [
            variable
            for (source_phc, _), variable in shipments.items()
            if source_phc == source["phc_id"]
        ]

        if outgoing:
            solver.Add(sum(outgoing) <= source["surplus"])

    # Destination demand constraints
    for destination in destinations:
        incoming = [
            variable
            for (_, destination_phc), variable in shipments.items()
            if destination_phc == destination["phc_id"]
        ]

        if incoming:
            solver.Add(sum(incoming) == destination["required"])

    # Minimize quantity × distance
    objective = solver.Objective()

    for key, variable in shipments.items():
        objective.SetCoefficient(
            variable,
            distance_map[key],
        )

    objective.SetMinimization()

    status = solver.Solve()

    if status != pywraplp.Solver.OPTIMAL:
        raise RuntimeError("No optimal redistribution plan found.")

    return [
        {
            "source_phc": source_phc,
            "destination_phc": destination_phc,
            "quantity": round(variable.solution_value(), 2),
            "distance_km": distance_map[(source_phc, destination_phc)],
        }
        for (source_phc, destination_phc), variable in shipments.items()
        if variable.solution_value() > 0
    ]