import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Database, Upload } from 'lucide-react';
import { 
  migrateProductsToFirestore, 
  checkFirestoreProducts, 
  backupFirestoreProducts 
} from '@/services/migrationService';
import { useToast } from '@/hooks/use-toast';

const MigrationPanel = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'checking' | 'migrating' | 'completed' | 'error'>('idle');
  const [hasFirestoreData, setHasFirestoreData] = useState<boolean | null>(null);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const checkDataStatus = async () => {
    setMigrationStatus('checking');
    try {
      const hasData = await checkFirestoreProducts();
      setHasFirestoreData(hasData);
      setMigrationStatus('idle');
      
      toast({
        title: hasData ? "Firestore Data Found" : "No Firestore Data",
        description: hasData 
          ? "Products are already available in Firestore" 
          : "No products found in Firestore. Migration needed.",
      });
    } catch (error) {
      setMigrationStatus('error');
      setErrorMessage('Failed to check Firestore data status');
      toast({
        title: "Error",
        description: "Failed to check Firestore data status",
        variant: "destructive"
      });
    }
  };

  const startMigration = async () => {
    setMigrationStatus('migrating');
    setMigrationProgress(0);
    setErrorMessage('');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setMigrationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      await migrateProductsToFirestore();
      
      clearInterval(progressInterval);
      setMigrationProgress(100);
      setMigrationStatus('completed');
      setHasFirestoreData(true);

      toast({
        title: "Migration Completed",
        description: "All products have been successfully migrated to Firestore",
      });
    } catch (error) {
      setMigrationStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Migration failed');
      toast({
        title: "Migration Failed",
        description: "Failed to migrate products to Firestore",
        variant: "destructive"
      });
    }
  };

  const createBackup = async () => {
    try {
      await backupFirestoreProducts();
      toast({
        title: "Backup Created",
        description: "Firestore products backed up to localStorage",
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create backup",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Firestore Migration Panel
          </CardTitle>
          <CardDescription>
            Migrate your static product data to Firestore database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Check */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Firestore Data Status</h3>
              <p className="text-sm text-muted-foreground">
                {hasFirestoreData === null 
                  ? "Click to check if products exist in Firestore"
                  : hasFirestoreData 
                    ? "Products found in Firestore" 
                    : "No products in Firestore"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasFirestoreData === true && <CheckCircle className="h-5 w-5 text-green-500" />}
              {hasFirestoreData === false && <AlertCircle className="h-5 w-5 text-yellow-500" />}
              <Button 
                onClick={checkDataStatus} 
                disabled={migrationStatus === 'checking'}
                variant="outline"
              >
                {migrationStatus === 'checking' ? 'Checking...' : 'Check Status'}
              </Button>
            </div>
          </div>

          {/* Migration Section */}
          {hasFirestoreData === false && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No products found in Firestore. You need to migrate your static product data.
                </AlertDescription>
              </Alert>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Migrate Products to Firestore</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This will copy all products from your static data to Firestore database.
                </p>
                
                {migrationStatus === 'migrating' && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Migration Progress</span>
                      <span>{migrationProgress}%</span>
                    </div>
                    <Progress value={migrationProgress} />
                  </div>
                )}

                <Button 
                  onClick={startMigration}
                  disabled={migrationStatus === 'migrating'}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {migrationStatus === 'migrating' ? 'Migrating...' : 'Start Migration'}
                </Button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {migrationStatus === 'completed' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Migration completed successfully! Your products are now stored in Firestore.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {migrationStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Backup Section */}
          {hasFirestoreData === true && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Backup Firestore Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a backup of your Firestore products to localStorage.
              </p>
              <Button onClick={createBackup} variant="outline">
                Create Backup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationPanel;