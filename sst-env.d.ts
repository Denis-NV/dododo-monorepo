/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "AccessSessionSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AccessTokenSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "CipherKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DododoEmail": {
      "configSet": string
      "sender": string
      "type": "sst.aws.Email"
    }
    "RefreshTokenSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "SupabaseOrgId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "dododoApi": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "dododoAssesment": {
      "type": "sst.aws.Remix"
      "url": string
    }
    "dododoDatabase": {
      "database": string
      "host": string
      "password": string
      "port": number
      "type": "supabase.index/project.Project"
      "user": string
    }
    "dododoStorage": {
      "name": string
      "type": "sst.aws.Bucket"
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}