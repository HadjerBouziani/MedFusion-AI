import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { SimilarCase } from '../types/case';
import { ExternalLink } from 'lucide-react';

interface SimilarCasesPanelProps {
  cases: SimilarCase[];
}

export function SimilarCasesPanel({ cases }: SimilarCasesPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Cases</CardTitle>
        <CardDescription>Previously analyzed cases with similar patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((similarCase) => (
            <div
              key={similarCase.caseId}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-500 transition-colors cursor-pointer"
            >
              <img
                src={similarCase.imageUrl}
                alt="Similar case"
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{similarCase.diagnosis}</span>
                  <Badge variant="secondary">{similarCase.similarity}% match</Badge>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(similarCase.date).toLocaleDateString()}
                </p>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View case <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
