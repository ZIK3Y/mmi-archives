package com.tp.mmi.archive.dto;

import com.tp.mmi.archive.models.Sae;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class SaeDTO {

    public record GroupeDTO(
        Long idGroupe,
        String nomGroupe,
        List<String> membres,
        String anneePromo,
        float note
    ) {}

    public record ImageDTO(
        Long idImage,
        String url,
        String legende,
        int ordre
    ) {}

    public record CompetenceDTO(
        Long idCompetence,
        String codeCompetence,
        String libelle
    ) {}

    private Long idSae;
    private String titre;
    private String description;
    private String anneePromo;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private float tauxReussite;
    private String lienSite;
    private String lienProduction;

    private String domaine;
    private String semestre;
    private String ue;
    private float note;
    private String ressourcesHumaines;

    private List<CompetenceDTO> competences;
    private List<GroupeDTO> groupes;
    private List<ImageDTO> images;

    public SaeDTO(Sae sae) {
        this.idSae = sae.getIdSae();
        this.titre = sae.getTitre();
        this.description = sae.getDescription();
        this.anneePromo = sae.getAnneePromo();
        this.dateDebut = sae.getDateDebut();
        this.dateFin = sae.getDateFin();
        this.tauxReussite = sae.getTauxReussite();
        this.lienSite = sae.getLienSite();
        this.lienProduction = sae.getLienProduction();
        this.ressourcesHumaines = "";

        this.domaine = sae.getDomaine() != null ? sae.getDomaine().getLibelle() : "";

        if (sae.getUe() != null) {
            this.ue = sae.getUe().getCodeUe();
            this.semestre = "S" + sae.getUe().getSemestre();
        } else {
            this.ue = "";
            this.semestre = "";
        }

        // Note = moyenne des notes de tous les groupes
        if (sae.getGroupeSaes() != null && !sae.getGroupeSaes().isEmpty()) {
            this.note = (float) sae.getGroupeSaes().stream()
                .mapToDouble(gs -> gs.getNote())
                .average()
                .orElse(0.0);
        } else {
            this.note = 0f;
        }

        this.competences = sae.getSaeCompetences() != null
            ? sae.getSaeCompetences().stream()
                .filter(sc -> sc.getCompetence() != null)
                .map(sc -> new CompetenceDTO(
                    sc.getCompetence().getIdCompetence(),
                    sc.getCompetence().getCodeCompetence(),
                    sc.getCompetence().getLibelle()
                ))
                .collect(Collectors.toList())
            : List.of();

        // Chaque groupe avec sa propre note
        this.groupes = sae.getGroupeSaes() != null
            ? sae.getGroupeSaes().stream()
                .filter(gs -> gs.getGroupe() != null)
                .map(gs -> {
                    var g = gs.getGroupe();
                    List<String> membres = new ArrayList<>();
                    if (g.getEtudiant1() != null && !g.getEtudiant1().isBlank()) membres.add(g.getEtudiant1());
                    if (g.getEtudiant2() != null && !g.getEtudiant2().isBlank()) membres.add(g.getEtudiant2());
                    if (g.getEtudiant3() != null && !g.getEtudiant3().isBlank()) membres.add(g.getEtudiant3());
                    if (g.getEtudiant4() != null && !g.getEtudiant4().isBlank()) membres.add(g.getEtudiant4());
                    if (g.getEtudiant5() != null && !g.getEtudiant5().isBlank()) membres.add(g.getEtudiant5());
                    return new GroupeDTO(g.getIdGroupe(), g.getNomGroupe(), membres, g.getAnneePromo(), gs.getNote());
                })
                .collect(Collectors.toList())
            : List.of();

        this.images = sae.getImages() != null
            ? sae.getImages().stream()
                .map(img -> new ImageDTO(img.getIdImage(), img.getUrl(), img.getLegende(), img.getOrdre()))
                .collect(Collectors.toList())
            : List.of();
    }

    public Long getIdSae() { return idSae; }

    public String getTitre() { return titre; }

    public String getDescription() { return description; }

    public String getAnneePromo() { return anneePromo; }

    public LocalDate getDateDebut() { return dateDebut; }

    public LocalDate getDateFin() { return dateFin; }

    public float getTauxReussite() { return tauxReussite; }

    public String getLienSite() { return lienSite; }

    public String getLienProduction() { return lienProduction; }

    public String getDomaine() { return domaine; }

    public String getSemestre() { return semestre; }

    public String getUe() { return ue; }

    public float getNote() { return note; }

    public String getRessourcesHumaines() { return ressourcesHumaines; }

    public List<CompetenceDTO> getCompetences() { return competences; }

    public List<GroupeDTO> getGroupes() { return groupes; }
    
    public List<ImageDTO> getImages() { return images; }
}
