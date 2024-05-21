import { LEAGUES } from 'server/src/services/filters/pokemon/constants'
import type {
  ScannerModels,
  ScannerModelKeys,
  RmModels,
  RmModelKeys,
  ModelKeys,
} from 'server/src/models'
import { Knex } from 'knex'
import { Model } from 'objection'
import { Request, Response } from 'express'
import { Transaction } from '@sentry/node'
import { VerifyCallback } from 'passport-oauth2'

import DbCheck = require('server/src/services/DbCheck')
import EventManager = require('server/src/services/EventManager')
import Pokemon = require('server/src/models/Pokemon')
import Gym = require('server/src/models/Gym')
import Badge = require('server/src/models/Badge')
import Backup = require('server/src/models/Backup')
import Nest = require('server/src/models/Nest')
import NestSubmission = require('server/src/models/NestSubmission')
import Pokestop = require('server/src/models/Pokestop')
import { ModelReturn, OnlyType } from './utility'
import { Profile } from 'passport-discord'
import { User } from './models'
import { Config } from '@rm/types'

export interface DbContext {
  isMad: boolean
  pvpV2: boolean
  mem: string
  secret: string
  hasSize: boolean
  hasHeight: boolean
  hasRewardAmount: boolean
  hasPowerUp: boolean
  hasAltQuests: boolean
  hasLayerColumn: boolean
  hasMultiInvasions: boolean
  multiInvasionMs: boolean
  hasConfirmed: boolean
  availableSlotsCol: string
  polygon: boolean
  hasAlignment: boolean
  hasShowcaseData: boolean
  hasShowcaseForm: boolean
  hasShowcaseTypes: boolean
}

export interface ExpressUser extends User {
  perms: Permissions
  valid: boolean
  avatar: string
  webhookStrategy?: Strategy
  rmStrategy: string
}

export interface AvailablePokemon {
  id: number
  form: number
  count: number
}

export interface Available {
  pokemon: ModelReturn<typeof Pokemon, 'getAvailable'>
  gyms: ModelReturn<typeof Gym, 'getAvailable'>
  pokestops: ModelReturn<typeof Pokestop, 'getAvailable'>
  nests: ModelReturn<typeof Nest, 'getAvailable'>
}

export interface ApiEndpoint {
  type: string
  endpoint: string
  secret: string
  useFor: Lowercase<ModelKeys>[]
}

export interface DbConnection {
  host: string
  port: number
  username: string
  password: string
  database: string
  useFor: Lowercase<ModelKeys>[]
}

export type Schema = ApiEndpoint | DbConnection

export interface DbCheckClass {
  models: {
    [key in ScannerModelKeys]?: (DbContext & {
      connection: number
      SubModel: ScannerModels[key]
    })[]
  } & Partial<RmModels>
  validModels: ScannerModelKeys[]
  singleModels: readonly RmModelKeys[]
  searchLimit: number
  endpoints: { [key: number]: ApiEndpoint }
  connections: (Knex | null)[]
  rarity: Rarity
  historical: Rarity
  questConditions: { [key: string]: string[] }
  rarityPercents: RarityPercents
  reactMapDb: null | number
  filterContext: {
    Route: { maxDistance: number; maxDuration: number }
    Pokestop: { hasConfirmedInvasions: boolean }
  }
}

export interface RarityPercents {
  common: number
  uncommon: number
  rare: number
  ultraRare: number
  regional: number
  never: number
  event: number
}

export type Rarity = { [key: string]: keyof RarityPercents }

export interface BaseRecord {
  id: number | string
  lat: number
  lon: number
  updated: number
  distance?: number
}

export interface GqlContext {
  req: Request
  res: Response
  Db: DbCheck
  Event: EventManager
  perms: Permissions
  user: string
  transaction: Transaction
  operation: 'query' | 'mutation'
  startTime?: number
}

export interface Permissions {
  map: boolean
  pokemon: boolean
  iv: boolean
  pvp: boolean
  gyms: boolean
  raids: boolean
  pokestops: boolean
  eventStops: boolean
  quests: boolean
  lures: boolean
  portals: boolean
  submissionCells: boolean
  invasions: boolean
  nests: boolean
  nestSubmissions: boolean
  scanAreas: boolean
  weather: boolean
  spawnpoints: boolean
  s2cells: boolean
  scanCells: boolean
  devices: boolean
  donor: boolean
  gymBadges: boolean
  backups: boolean
  routes: boolean
  blocked: boolean
  admin: boolean
  blockedGuildNames: string[]
  scanner: string[]
  areaRestrictions: string[]
  webhooks: string[]
  scannerCooldowns: Record<string, number>
}

export interface Waypoint {
  lat_degrees: number
  lng_degrees: number
  elevation_in_meters: number
}

export interface Route {
  id: string
  name: string
  description: string
  distance_meters: number
  duration_seconds: number
  start_fort_id: string
  start_lat: number
  start_lon: number
  start_image: string
  end_fort_id: string
  end_lat: number
  end_lon: number
  end_image: string
  image: string
  image_border_color: string
  reversible: boolean
  tags?: string[]
  type: number
  updated: number
  version: number
  waypoints: Waypoint[]
}

export interface FilterId {
  id: number
  form?: number
}
export interface DnfMinMax {
  min: number
  max: number
}

export interface DnfFilter {
  pokemon?: FilterId
  iv?: DnfMinMax
  level?: DnfMinMax
  cp?: DnfMinMax
  atk_iv?: DnfMinMax
  def_iv?: DnfMinMax
  sta_iv?: DnfMinMax
  gender?: DnfMinMax
  size?: DnfMinMax
  pvp_little?: DnfMinMax
  pvp_great?: DnfMinMax
  pvp_ultra?: DnfMinMax
}

export type DiscordVerifyFunction = (
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => void

export type BaseFilter = import('server/src/services/filters/Base')

export type PokemonFilter =
  import('server/src/services/filters/pokemon/Frontend')

export type AllFilters = ReturnType<
  typeof import('server/src/services/filters/builder/base')
>

export type Categories = keyof AllFilters

export type AdvCategories = 'pokemon' | 'gyms' | 'pokestops' | 'nests'

export type UIObject = ReturnType<
  typeof import('server/src/services/ui/primary')
>

export interface PokemonGlow
  extends Partial<Omit<Config['clientSideOptions']['pokemon'], 'glow'>> {
  glow: boolean
  Hundo?: string
  Nundo?: string
  'Top PVP Rank'?: string
  Multiple?: string
}
export interface ClientOptions
  extends Partial<Omit<Config['clientSideOptions'], 'pokemon'>> {
  pokemon: PokemonGlow
}
