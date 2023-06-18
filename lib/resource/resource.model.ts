export abstract class ResourceModel {
  abstract table: string;
  abstract fillable: string[];
  abstract selectable: string[];
}
