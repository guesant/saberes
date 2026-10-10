export interface QuestionContextReadModel {
    id: number;
    title: string;
    content: string;
    position: number;
    assets?: Array<{
        id: number;
        path: string;
        mediaType: string;
        altText: string;
        position: number;
    }>;
}
