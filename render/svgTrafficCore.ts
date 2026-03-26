export interface GeoPoint {
  latitude: number
  longitude: number
  city?: string
  country?: string
  region?: string
  ip?: string
}

export interface SvgPoint {
  x: number
  y: number
}

export interface TrafficConnectionLike {
  id: string
  host: string
  destinationIP: string
  download: number
  upload: number
  raw: unknown
}

export interface SvgTrafficPoint {
  ip: string
  geo: GeoPoint
  svg: SvgPoint
  label: string
}

export interface SvgTrafficRoute {
  id: string
  host: string
  connection: TrafficConnectionLike
  source: SvgTrafficPoint
  destination: SvgTrafficPoint
  proxy?: SvgTrafficPoint | null
  finalOutboundName: string | null
}

export interface FlightRouteHostAdapter {
  getEgressIp(): Promise<string | null>
  fetchGeoPoint(ip: string): Promise<GeoPoint | null>
  listConnections(limit: number): Promise<TrafficConnectionLike[]>
  resolveProxyHopGeoPoint?(connection: TrafficConnectionLike): Promise<GeoPoint | null>
  getFinalOutboundName?(connection: TrafficConnectionLike): string | null
}

export interface FlightRouteCoreDeps {
  geoToSvgPoint(geo: GeoPoint): SvgPoint
  host: FlightRouteHostAdapter
}

export const resolveEgressPoint = async (
  deps: FlightRouteCoreDeps,
): Promise<SvgTrafficPoint | null> => {
  const ip = await deps.host.getEgressIp()
  if (!ip) return null
  const geo = await deps.host.fetchGeoPoint(ip)
  if (!geo) return null
  return {
    ip,
    geo,
    svg: deps.geoToSvgPoint(geo),
    label: 'Egress',
  }
}

export const resolveSvgTrafficRoutes = async (
  deps: FlightRouteCoreDeps,
  limit = 80,
): Promise<SvgTrafficRoute[]> => {
  const egress = await resolveEgressPoint(deps)
  if (!egress) return []

  const routes: SvgTrafficRoute[] = []
  const connections = await deps.host.listConnections(limit)

  for (const conn of connections) {
    try {
      const destinationGeo = await deps.host.fetchGeoPoint(conn.destinationIP)
      if (!destinationGeo) continue

      const destination: SvgTrafficPoint = {
        ip: conn.destinationIP,
        geo: destinationGeo,
        svg: deps.geoToSvgPoint(destinationGeo),
        label: conn.host || conn.destinationIP,
      }

      let proxyPoint: SvgTrafficPoint | null = null
      try {
        const proxyGeo = await deps.host.resolveProxyHopGeoPoint?.(conn)
        if (proxyGeo) {
          proxyPoint = {
            ip: proxyGeo.ip || '',
            geo: proxyGeo,
            svg: deps.geoToSvgPoint(proxyGeo),
            label: deps.host.getFinalOutboundName?.(conn) || 'Proxy',
          }
        }
      } catch {
        proxyPoint = null
      }

      routes.push({
        id: conn.id,
        host: destination.label,
        connection: conn,
        source: egress,
        destination,
        proxy: proxyPoint,
        finalOutboundName: deps.host.getFinalOutboundName?.(conn) || null,
      })
    } catch {
      continue
    }
  }

  return routes
}
