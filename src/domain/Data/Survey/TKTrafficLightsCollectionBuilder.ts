export interface TKTrafficLightsRaw {
  name: string;
  value: string;
  color: string;
  type: string;
}
interface TKTrafficLightItem {
  type: string;
  values: [
    {
      value: string;
      color: string;
    }
  ];
}
export interface TKTrafficLightsCollection {
  [propName: string]: TKTrafficLightItem;
}

export function TKTrafficLightsCollectionBuilder(
  rawData: TKTrafficLightsRaw[]
): TKTrafficLightsCollection {
  const trafficLights: TKTrafficLightsCollection = {};
  for (const item of rawData) {
    if (trafficLights[item.name]) {
      trafficLights[item.name].values.push({
        value: item.value,
        color: item.color
      });
    } else {
      if (item.name.length > 0) {
        trafficLights[item.name] = {
          type: item.type,
          values: [
            {
              value: item.value,
              color: item.color
            }
          ]
        };
      }
    }
  }
  return trafficLights;
}
