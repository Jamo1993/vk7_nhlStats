import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface playerStats {
  skaterFullName: string;
  teamAbbrevs: string;   
  shots: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  gamesPlayed: number;
  pointsPerGame: number; 
  shootingPct: number; 
}



export default function App() {

  const [playerName,setPlayerName] = useState<string>('');
  const [playerStats,setPlayerStats]= useState<playerStats | null>(null);
  const [loading,setLoading]= useState(false);
  const [error,setError]=useState<string | null>(null);

  const handleSearch = async () => {
    if (!playerName.trim())return
  

  try {
    setLoading(true);
    setError(null);
    setPlayerStats(null);
  

  const response= await fetch(
    "https://api.nhle.com/stats/rest/en/skater/summary?limit=-1&cayenneExp=seasonId=20252026%20and%20gameTypeId=2"
  )

  if (!response.ok){
    throw new Error("Failed to fetch data")
  }

  const json = await response.json();
  const players:playerStats[]=json.data

  const search = playerName.toLowerCase();
  const found = players.find(p=>
    p.skaterFullName.toLowerCase().includes(search)
  );

  if (!found) {
    setError ("No player found ");
  }else {
    setPlayerStats(found);
  }

  } catch (e) {
    console.error(e);
    setError("Error while fetching data.")
  }finally {
    setLoading(false);
  }
}



  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.Heading}> NHL Players statistics search </Text>

        <TextInput
        style={styles.input}
        placeholder= "Enter player name"
        value= {playerName}
        onChangeText= {setPlayerName}
        />

        <Button title="Search" onPress={handleSearch} />

        {loading && <Text style={{ marginTop: 20 }}>Loading...</Text>}

        {error && (
          <Text style={{ marginTop: 20, color: 'red' }}>{error}</Text>
        )}

        {playerStats && (
          <View style={styles.playerStats}>
            <Text>Player: {playerStats.skaterFullName}</Text>
            <Text>Team: {playerStats.teamAbbrevs}</Text>
            <Text>Games played: {playerStats.gamesPlayed}</Text>
            <Text>Goals: {playerStats.goals}</Text>
            <Text>Shots: {playerStats.shots}</Text>
            <Text>Shooting percentage: {playerStats.shootingPct}%</Text>
            <Text>Assists: {playerStats.assists}</Text>
            <Text>Points: {playerStats.points}</Text>
            <Text>Points per game: {playerStats.pointsPerGame}</Text>
            <Text>+/-: {playerStats.plusMinus}</Text>
          </View>
        )}



      <StatusBar style="auto" />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    width:'100%',
    borderWidth:2,
    paddingHorizontal:10,
    paddingVertical:10,
    marginBottom:20,
    
    
  },
  Heading: {
    padding:20,
    fontSize:25,
    fontWeight:'bold',
  },
  title: {
   padding:20,
   marginBottom:20,
  },
  playerStats: {
    marginTop:20,
    borderWidth:1,
    paddingHorizontal:10,
    paddingVertical:10,

  }
});
