import { useState } from "react";
import {
  Radio,
  Play,
  Pause,
  Plus,
  Music,
  Volume2,
  Calendar,
  Megaphone,
  Sparkles,
  Loader2,
  Trash2,
  Edit,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePlaylists, useAnnouncements } from "@/hooks/useRadio";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function RadioOxigenio() {
  const { playlists, isLoading: playlistsLoading, createPlaylist, updatePlaylist, deletePlaylist } = usePlaylists();
  const { announcements, isLoading: announcementsLoading, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [activeTab, setActiveTab] = useState("now-playing");
  
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState("");
  const [newAnnouncementContent, setNewAnnouncementContent] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const currentPlaylist = playlists.find(p => p.active) || playlists[0];

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    createPlaylist.mutate({
      name: newPlaylistName,
      description: newPlaylistDescription,
      tracks: [],
      duration_seconds: 0,
      active: true,
    }, {
      onSuccess: () => {
        setPlaylistDialogOpen(false);
        setNewPlaylistName("");
        setNewPlaylistDescription("");
      }
    });
  };

  const handleCreateAnnouncement = () => {
    if (!newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) return;
    createAnnouncement.mutate({
      title: newAnnouncementTitle,
      content: newAnnouncementContent,
      duration_seconds: 30,
      priority: 1,
      active: true,
      ai_generated: false,
      audio_url: null,
      scheduled_at: null,
      repeat_interval_minutes: 60,
    }, {
      onSuccess: () => {
        setAnnouncementDialogOpen(false);
        setNewAnnouncementTitle("");
        setNewAnnouncementContent("");
      }
    });
  };

  const handleGenerateAIAnnouncement = async () => {
    setIsGeneratingAI(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-ai", {
        body: {
          message: "Crie um anúncio promocional para a rádio da academia",
          type: "generate_announcement",
        },
      });

      if (error) throw error;

      setNewAnnouncementContent(data.response);
      setNewAnnouncementTitle("Anúncio Gerado por IA");
      toast.success("Anúncio gerado com sucesso!");
    } catch (error) {
      console.error("Error generating announcement:", error);
      toast.error("Erro ao gerar anúncio");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const isLoading = playlistsLoading || announcementsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Radio className="w-8 h-8 text-primary" />
            Rádio Oxigênio
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie playlists, agendamentos e anúncios da rádio interna
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
          </span>
          <span className="text-sm font-medium text-destructive">AO VIVO</span>
        </div>
      </div>

      {/* Now Playing Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Album Art */}
            <div className="relative">
              <div className="w-32 h-32 rounded-xl bg-gradient-primary flex items-center justify-center animate-pulse-glow">
                <Radio className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm text-muted-foreground mb-1">Tocando agora</p>
              <h2 className="text-2xl font-bold">{currentPlaylist?.name || "Nenhuma playlist"}</h2>
              <p className="text-muted-foreground">HimeFit Radio</p>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm text-muted-foreground">2:34</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-primary rounded-full animate-shimmer"
                    style={{ width: "65%", backgroundSize: "200% 100%" }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">3:45</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-gradient-primary hover:opacity-90"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
              </div>
              
              {/* Volume */}
              <div className="flex items-center gap-3 w-48">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-8">{volume}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="now-playing" className="gap-2">
            <Music className="w-4 h-4" />
            Playlists
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="w-4 h-4" />
            Agendamento
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="w-4 h-4" />
            Anúncios
          </TabsTrigger>
        </TabsList>

        {/* Playlists Tab */}
        <TabsContent value="now-playing" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Playlists</h3>
            <Button onClick={() => setPlaylistDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Playlist
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{playlist.name}</CardTitle>
                    <Switch
                      checked={playlist.active}
                      onCheckedChange={(active) => updatePlaylist.mutate({ id: playlist.id, active })}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {playlist.description || "Sem descrição"}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      <Music className="w-3 h-3 mr-1" />
                      {playlist.tracks?.length || 0} músicas
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deletePlaylist.mutate(playlist.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Agendamento Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="font-medium mb-2">{day}</div>
                    <div className="space-y-2">
                      <div className="p-2 rounded bg-secondary text-xs">
                        <Clock className="w-3 h-3 mx-auto mb-1" />
                        6h - 12h
                        <p className="text-muted-foreground truncate">Motivational</p>
                      </div>
                      <div className="p-2 rounded bg-secondary text-xs">
                        <Clock className="w-3 h-3 mx-auto mb-1" />
                        12h - 18h
                        <p className="text-muted-foreground truncate">Chill</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Anúncios</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGenerateAIAnnouncement} disabled={isGeneratingAI}>
                {isGeneratingAI ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Gerar com IA
              </Button>
              <Button onClick={() => setAnnouncementDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Anúncio
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        {announcement.ai_generated && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            IA
                          </Badge>
                        )}
                        <Badge
                          variant={announcement.active ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {announcement.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Prioridade: {announcement.priority}</span>
                        <span>Reproduzido: {announcement.plays_count}x</span>
                        {announcement.repeat_interval_minutes && (
                          <span>Repete a cada {announcement.repeat_interval_minutes} min</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={announcement.active}
                        onCheckedChange={(active) => updateAnnouncement.mutate({ id: announcement.id, active })}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteAnnouncement.mutate(announcement.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Playlist Dialog */}
      <Dialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Nova Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Nome da playlist"
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                placeholder="Descrição da playlist"
                className="bg-secondary border-border"
              />
            </div>
            <Button onClick={handleCreatePlaylist} className="w-full bg-gradient-primary">
              Criar Playlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Announcement Dialog */}
      <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Novo Anúncio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={newAnnouncementTitle}
                onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                placeholder="Título do anúncio"
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Conteúdo</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateAIAnnouncement}
                  disabled={isGeneratingAI}
                >
                  {isGeneratingAI ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-1" />
                  )}
                  Gerar com IA
                </Button>
              </div>
              <Textarea
                value={newAnnouncementContent}
                onChange={(e) => setNewAnnouncementContent(e.target.value)}
                placeholder="Texto do anúncio"
                className="bg-secondary border-border min-h-[100px]"
              />
            </div>
            <Button onClick={handleCreateAnnouncement} className="w-full bg-gradient-primary">
              Criar Anúncio
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
