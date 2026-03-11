package com.tp.mmi.archive.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Sae {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long idSae;

    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String anneePromo;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private float tauxReussite;
    private String lienSite;
    private String lienProduction;

    @ManyToOne
    @JoinColumn(name = "id_domaine")
    private Domaine domaine;

    @ManyToOne
    @JoinColumn(name = "id_ue")
    private Ue ue;

    @OneToMany(mappedBy = "sae", cascade = CascadeType.ALL)
    private List<GroupeSae> groupeSaes;

    @OneToMany(mappedBy = "sae", cascade = CascadeType.ALL)
    private List<SaeCompetence> saeCompetences;

    @OneToMany(mappedBy = "sae", cascade = CascadeType.ALL)
    private List<Image> images;

    public Sae() {}

    public Sae(String titre, String description, String anneePromo, LocalDate dateDebut,
               LocalDate dateFin, float tauxReussite, String lienSite, String lienProduction,
               Domaine domaine, Ue ue) {
        this.titre = titre;
        this.description = description;
        this.anneePromo = anneePromo;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.tauxReussite = tauxReussite;
        this.lienSite = lienSite;
        this.lienProduction = lienProduction;
        this.domaine = domaine;
        this.ue = ue;
    }

    public Long getIdSae() { return idSae; }
    public void setIdSae(Long idSae) { this.idSae = idSae; }
    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAnneePromo() { return anneePromo; }
    public void setAnneePromo(String anneePromo) { this.anneePromo = anneePromo; }
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    public float getTauxReussite() { return tauxReussite; }
    public void setTauxReussite(float tauxReussite) { this.tauxReussite = tauxReussite; }
    public String getLienSite() { return lienSite; }
    public void setLienSite(String lienSite) { this.lienSite = lienSite; }
    public String getLienProduction() { return lienProduction; }
    public void setLienProduction(String lienProduction) { this.lienProduction = lienProduction; }
    public Domaine getDomaine() { return domaine; }
    public void setDomaine(Domaine domaine) { this.domaine = domaine; }
    public Ue getUe() { return ue; }
    public void setUe(Ue ue) { this.ue = ue; }
    public List<GroupeSae> getGroupeSaes() { return groupeSaes; }
    public void setGroupeSaes(List<GroupeSae> groupeSaes) { this.groupeSaes = groupeSaes; }
    public List<SaeCompetence> getSaeCompetences() { return saeCompetences; }
    public void setSaeCompetences(List<SaeCompetence> saeCompetences) { this.saeCompetences = saeCompetences; }
    public List<Image> getImages() { return images; }
    public void setImages(List<Image> images) { this.images = images; }
}
